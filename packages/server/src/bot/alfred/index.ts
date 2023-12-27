import { z } from 'zod';
import { quizType } from './types';
import { jsonQuizData } from './utils/types';
import { schema, schemaTestOut } from './schema';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { parseQuestions } from './utils/parseQuestions';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { IQuizByJsonData, IQuizQuestionJsonData } from '../../types';
import { JsonOutputFunctionsParser } from 'langchain/output_parsers';
import { ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate } from 'langchain/prompts';


// Best results for GPT-4, if using 3.5 up to 30 questions at a time have been tested
export const MAX_QUESTIONS_PER_QUIZ = (process.env.MAX_QUESTIONS_PER_QUIZ ? parseInt(process.env.MAX_QUESTIONS_PER_QUIZ, 10) : null) ?? 10;
export const MODEL_NAME = process.env.OPENAI_MODEL_NAME ?? 'gpt-4';

export const Z_TYPE = z.string().describe(`The type of question, valid types are: MultipleChoice, FillInTheBlank, ShortAnswer, Matching, Ordering, Image.
 Currently MultipleChoice is the only supported option.`);
export const Z_ANSWER = z.string().describe('The answer to the question, must be one of the options');
export const Z_TOPICS = z.string().describe(`Topics should be concise and as specific and generic as possible, ideally one word summaries
 of the question, should not include the answer nor give it away`);
export const Z_TOPIC_QUIZ = z.array(z.string()
    .describe(`The overarching topics that the user provided text is related to. Can not be hyphenated. Should be as general as possible these will be used like an index.`));
export const Z_QUIZ_DESC = 'An array of questions that come from the user provided text. Each question should be converted to a multiple choice question if possible.';

/**
 * Schema for Basic Quizzes that only have the question and answer options
 */
export const zodSchema = z.object({
    questions: z
        .array(
            z.object({
                type: Z_TYPE,
                answer: Z_ANSWER,
                topics: Z_TOPICS,
                explanation: z.string().optional().describe('A textbook explanation for the answer to the question'),
                areaToReview: z.array(z.string().describe('Subject matter that the student should review to better understand the question, this is like a topic')),
            })
        )
        .describe(Z_QUIZ_DESC),
    topics: Z_TOPIC_QUIZ
});

/**
 * Schema for quizzes that come from Test Out, they provide extra information and require more parsing
 */
export const zodSchemaTestOut = z.object({
    questions: z
        .array(
            z.object({
                type: Z_TYPE,
                answer: Z_ANSWER,
                topics: Z_TOPICS
            })
        )
        .describe(Z_QUIZ_DESC),
    topics: Z_TOPIC_QUIZ
});

/**
 * Prompt for the OpenAI model
 */
export const prompt = new ChatPromptTemplate({
    promptMessages: [
        // prompts the model
        SystemMessagePromptTemplate.fromTemplate(
            ['You are a Cybersecurity Engineering expert that is assisting in creating quizzes for students',
                `You have been given the following structured text from a student and need to help convert it to the quiz format.`,
                'All questions should be multiple choice and your generated output must match the following data schema exactly:{schema}'
            ].join(' ')
        ),
        // mimics user input
        HumanMessagePromptTemplate.fromTemplate('{userText}')
    ],
    inputVariables: ['userText', 'schema']
});

/**
 * Our configured LLM, which is using GPT4 or 3.5 Turbo
 */
export const llm = new ChatOpenAI({ modelName: MODEL_NAME, temperature: 0.9, openAIApiKey: process.env.OPENAI_API_KEY });


/**
 * Takes the array of json quiz data and flattens it to one quiz by combining the questions and topics
 *
 * @param quizData - An array of json quiz data
 * @returns A json quiz data object that contains all of the questions and topics from the array of json quiz data
 */
export const flattenToOneQuiz = (quizData: jsonQuizData[]): jsonQuizData => {
    const questions = quizData.reduce((acc, quiz) => {
        acc.push(...quiz.questions);
        return acc;
    }, [] as jsonQuizData['questions']);

    const topics = quizData.reduce((acc, quiz) => {
        acc.push(...quiz.topics);
        return acc;
    }, [] as jsonQuizData['topics']);

    const uniqueTopics = new Set();
    topics.forEach(topic => {
        uniqueTopics.add(topic);
    });

    return {
        questions,
        name: 'Quiz',
        topics: Array.from(uniqueTopics) as string[]
    }
}

/**
 * Generates an array of json quiz data from a user provided text file
 *
 * @param pathToFile - The path to the file that contains the user provided text
 * @param quizType - The type of quiz to parse, the only options are `'ua'` or `'test-out'`
 * @param individualQuizzes - Whether or not to generate individual quizzes or one large quiz. This defaults to individual quizzes that
 * contain the maximum number of questions per quiz. So if a user provides 100 questions and the max questions per quiz is 30 then 4 quizzes will be generated.
 * If this is set to false then one large quiz will be generated with all 100 questions.
 * @returns An array of json quiz data. Each sub-array is a quiz to be generated
 */
export const generateQuizJsonFromTextFile = async (pathToFile: string, quizType: quizType = 'ua', individualQuizzes = true): Promise<jsonQuizData[]> => {
    const isUofA = quizType === 'ua';

    // configure lang chain
    const functionCallModel = llm.bind({
        functions: [
            {
                name: 'output_formatter',
                description: 'Should always be used to properly format output',
                parameters: zodToJsonSchema(isUofA ? zodSchema : zodSchemaTestOut)
            }
        ],
        function_call: { name: 'output_formatter' }
    });

    const outputParser = new JsonOutputFunctionsParser();
    const chain = prompt.pipe(functionCallModel).pipe(outputParser);

    // parse question details from text file
    const questions = isUofA ? await parseQuestions.UofA(pathToFile) : await parseQuestions.TestOut(pathToFile);

    // split the quiz into quizzes of the max number of questions
    const questionGroups = questions.reduce((acc, question, index) => {
        const groupIndex = Math.floor(index / MAX_QUESTIONS_PER_QUIZ);

        if (!acc[groupIndex]) {
            acc[groupIndex] = [];
        }

        acc[groupIndex].push(question);

        return acc;
    }, [] as Partial<typeof questions>[]);

    // Query the OpenAI API using our LangChain chain
    const quizData: jsonQuizData[] = await Promise.all(questionGroups.map(async group => {
        const json = await chain.invoke({
            userText: group.map(question => JSON.stringify(question)).join('\n'),
            schema: isUofA ? schema : schemaTestOut
        }) as jsonQuizData;

        return json;
    }));

    // merge the original question data with the data from OpenAI
    const merged = quizData.map((quiz: jsonQuizData, innerIndex: number) => {
        quiz.questions = quiz.questions.map((question: Partial<IQuizByJsonData>, outerIndex: number) => {
            const currentGroup = (questionGroups[innerIndex] ?? []) as Partial<IQuizQuestionJsonData>[];
            const currentQuestion = (currentGroup[outerIndex] ?? {});
            return {
                ...currentQuestion,
                ...question
            }
        })
        // ensure unique topics
        const topicSet = new Set();
        quiz?.topics?.forEach(topic => {
            // remove hyphens
            topicSet.add(topic.replace(/-/g, ' '));
        });
        // expects an array
        quiz.topics = Array.from(topicSet) as string[];
        return quiz;
    });

    return individualQuizzes ? merged : [flattenToOneQuiz(merged)];
};


export const alfred = {
    /**
     * Generates an array of json quiz data from a user provided text file
     *
     * @param pathToFile - The path to the file that contains the user provided text
     * @param quizType - The type of quiz to parse, the only options are `'ua'` or `'test-out'`
     * @param individualQuizzes - Whether or not to generate individual quizzes or one large quiz. This defaults to individual quizzes that
     * contain the maximum number of questions per quiz. So if a user provides 100 questions and the max questions per quiz is 30 then 4 quizzes will be generated.
     * If this is set to false then one large quiz will be generated with all 100 questions.
     * @returns An array of json quiz data. Each sub-array is a quiz to be generated
     */
    generateQuizJsonFromTextFile
};

export default alfred;
