import {z} from 'zod';
import {quizType} from './types';
import {jsonQuizData} from './utils/types';
import {schema, schemaTestOut} from './schema';
import {zodToJsonSchema} from 'zod-to-json-schema';
import {parseQuestions} from './utils/parseQuestions';
import {ChatOpenAI} from 'langchain/chat_models/openai';
import {IQuizByJsonData, IQuizQuestionJsonData} from '../../types';
import {JsonOutputFunctionsParser} from 'langchain/output_parsers';
import {parseMatchOptionsFromOptions} from './utils/parseQuestions/parseMatch';
import {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
} from 'langchain/prompts';

// Best results for GPT-4, if using 3.5 up to 30 questions at a time have been tested
export const MAX_QUESTIONS_PER_QUIZ =
  (process.env.MAX_QUESTIONS_PER_QUIZ ? parseInt(process.env.MAX_QUESTIONS_PER_QUIZ, 10) : null) ??
  10;
export const MODEL_NAME = process.env.OPENAI_MODEL_NAME ?? 'gpt-4';

export const Z_TYPE = z.string()
  .describe(`The type of question, valid types are: MultipleChoice, FillInTheBlank, SelectAllThatApply, ShortAnswer, Matching, Ordering, Image.
  This value should be a string and not an enum.
  Any true or false question should be converted to a MultipleChoice question with the options being True and False.`);
export const Z_ANSWER = z.string()
  .describe(`The answer to the question, must be one of the options if the question is a MultipleChoice question.
 If the question is a FillInTheBlank question then the answer should be the text that fills in the blank.
 If the question is a ShortAnswer question then the answer should be the text that answers the question.
 If the question is a Matching question or SelectAllThatApply then the answer should be a concatenated string
  of the matching options using a comma as a delimiter between selections.
  Within the individual selections, a hyphen or colon should be used to separate the option from the answer.`);
export const Z_TOPICS = z.string().describe(`Topics are a way to tag and categorize questions. 
  In no way is it appropriate for topics to be the same as the answer NOR should they give the answer away.They should be as specific as possible and can not be hyphenated.
Topic names should be selected like indexing a book. For example, if the question is about the OSI model then the topic should be 'OSI Model' and not 'Networking' or 'Model'.
Similarly, if the question comes from a section like '2.4.1 TCP/IP' then the topic should be 'TCP/IP' and not 'Networking' or 'IP'.
If a question encompasses multiple topics then it is appropriate to use multiple topics.
 For example, if a question is about the OSI model and TCP/IP then the topics should be 'OSI Model' and 'TCP/IP'`);
export const Z_TOPIC_QUIZ = z.array(
  z
    .string()
    .describe(
      `The overarching topics that the user provided text is related to. Can not be hyphenated. Should be as general as possible these will be used like an index.`,
    ),
);
export const Z_QUIZ_DESC =
  'An array of questions that come from the user provided text. Each question should be converted to a multiple choice question if possible.';

/**
 * Schema for Basic Quizzes that only have the question and answer options
 */
export const zodSchema = z.object({
  questions: z
    .array(
      z.object({
        type: Z_TYPE,
        answer: Z_ANSWER,
        topics: z.array(Z_TOPICS),
        explanation: z
          .string()
          .optional()
          .describe('A textbook explanation for the answer to the question'),
        areaToReview: z.array(
          z
            .string()
            .describe(
              'Subject matter or matters that the student should review to better understand the question, this is like a topic',
            ),
        ),
      }),
    )
    .describe(Z_QUIZ_DESC),
  topics: Z_TOPIC_QUIZ,
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
        topics: Z_TOPICS,
      }),
    )
    .describe(Z_QUIZ_DESC),
  topics: Z_TOPIC_QUIZ,
});

/**
 * Prompt for the OpenAI model
 */
export const prompt = new ChatPromptTemplate({
  promptMessages: [
    // prompts the model
    SystemMessagePromptTemplate.fromTemplate(
      [
        'You are a Cybersecurity Engineering expert that is assisting in creating quizzes for students',
        `You have been given the following structured text from a student and need to help convert it to the quiz format.`,
        'The generated output must match the following data schema: {schema}, ',
        'As a side node, all question types should be listed specifically as MultipleChoice, FillInTheBlank, SelectAllThatApply, ShortAnswer, Matching, Ordering, Image',
        ' This value should be a string and not an enum, the enum was provided to give you',
        'The values being used. In JS Enums do not exist so you will need to use a string for the type.',
        'All answers to the question must be in string format, do not use an array for the answer.',
      ].join(' '),
    ),
    // mimics user input
    HumanMessagePromptTemplate.fromTemplate('{userText}'),
  ],
  inputVariables: ['userText', 'schema'],
});

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
    topics: Array.from(uniqueTopics) as string[],
  };
};

/**
 * Generates an array of json quiz data from a user provided text file
 *
 * @param fileText - The text of the file
 * @param quizType - The type of quiz to parse, the only options are `'ua'` or `'test-out'`
 * @param individualQuizzes - Whether or not to generate individual quizzes or one large quiz. This defaults to individual quizzes that
 * contain the maximum number of questions per quiz. So if a user provides 100 questions and the max questions per quiz is 30 then 4 quizzes will be generated.
 * If this is set to false then one large quiz will be generated with all 100 questions.
 * @returns An array of json quiz data. Each sub-array is a quiz to be generated
 */
export const generateQuizJsonFromText = async (
  fileText: string,
  quizType: quizType = 'ua',
  individualQuizzes = true,
): Promise<jsonQuizData[]> => {
  const isUofA = quizType === 'ua';

  /**
   * Our configured LLM, which is using GPT4 or 3.5 Turbo
   */
  const llm = new ChatOpenAI({
    modelName: MODEL_NAME,
    temperature: 0.9,
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  // configure lang chain
  const functionCallModel = llm.bind({
    functions: [
      {
        name: 'output_formatter',
        description: 'Should always be used to properly format output',
        parameters: zodToJsonSchema(isUofA ? zodSchema : zodSchemaTestOut),
      },
    ],
    function_call: {name: 'output_formatter'},
  });

  const outputParser = new JsonOutputFunctionsParser();
  const chain = prompt.pipe(functionCallModel).pipe(outputParser);

  // parse question details from text file
  const questions = isUofA ? parseQuestions.UofA(fileText) : parseQuestions.TestOut(fileText);

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
  const quizData: jsonQuizData[] = await Promise.all(
    questionGroups.map(async group => {
      const json = (await chain.invoke({
        userText: group.map(question => JSON.stringify(question)).join('\n'),
        schema: isUofA ? schema : schemaTestOut,
      })) as jsonQuizData;

      return json;
    }),
  );

  // merge the original question data with the data from OpenAI
  const merged = quizData.map((quiz: jsonQuizData, innerIndex: number) => {
    // merge the original question data with the data generated by OpenAI
    quiz.questions = quiz.questions.map(
      (question: Partial<IQuizByJsonData>, outerIndex: number) => {
        const currentGroup = (questionGroups[innerIndex] ?? []) as Partial<IQuizQuestionJsonData>[];
        const currentQuestion = currentGroup[outerIndex] ?? {};

        // merge the original question data with the data generated by OpenAI
        const data = {
          ...currentQuestion,
          ...question,
        };

        // while we are here, we need to check the question type, if we are dealing with Matching, Or Ordering
        // we need to do some additional parsing
        if (data.type === 'Matching') {
          const parsed = parseMatchOptionsFromOptions(data);
          data.options = parsed.options;
          data.matchOptions = parsed.matchOptions;
          data.question = parsed.question;
        }
        // ensure the topics are not hyphenated
        // force data.topics to be an array
        data.topics = Array.isArray(data?.topics) ? data.topics : [data?.topics ?? ''];
        data.topics = data.topics?.map(topic => topic.replace(/-/g, ''));
        return data;
      },
    );

    // ensure unique topics
    const topicSet = new Set();
    quiz?.topics?.forEach(topic => topicSet.add(topic));
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
   * @param fileText - The path to the file that contains the user provided text
   * @param quizType - The type of quiz to parse, the only options are `'ua'` or `'test-out'`
   * @param individualQuizzes - Whether or not to generate individual quizzes or one large quiz. This defaults to individual quizzes that
   * contain the maximum number of questions per quiz. So if a user provides 100 questions and the max questions per quiz is 30 then 4 quizzes will be generated.
   * If this is set to false then one large quiz will be generated with all 100 questions.
   * @returns An array of json quiz data. Each sub-array is a quiz to be generated
   */
  generateQuizJsonFromText,
};

export default alfred;
