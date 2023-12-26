import { schema } from './schema';
import example from './schema/example.json';
import { LLMChain } from 'langchain/chains';
import { OpenAI } from 'langchain/llms/openai';
import { PromptTemplate } from 'langchain/prompts';

const llm: OpenAI = new OpenAI({ temperature: 0, openAIApiKey: process.env.OPENAI_API_KEY ?? '' });

const prompt: string[] = [
    'You are an accomplished Cybersecurity engineer and have been tasked with helping university students learn about cybersecurity and other topics.',
    'Given user provided unstructured text, you must generate JSON data that follows the schema for their quiz.',
    'The schema is written as TypeScript documentation, which describes the data\'s interface and is as follows: {schema}',
    'An example of the JSON output is as follows: {example}',
    'When generating topics, be extremely careful not to give away the answer to the question in the topic and to be concise and accurate,',
    'least amount of topics is best and the topics should be as general as possible.',
    'Topics cannot be hyphenated. C-I-A triad should be CIA triad. Multiple words can be separated by spaces.',
    'Any true/false questions should be converted to multiple choice questions with 2 options, True and False, refer to the example above.',
    'The user provided text is as follows: {userText}',
    'Your output must match the schema exactly and resemble the example as closely as possible. Please answer ALL questions.',
    'For now multiple choice questions are the only implemented question type, if you cannot convert a question to multiple choice, ignore it.',
];

const promptTemplate = PromptTemplate.fromTemplate(prompt.join('\n'));
const chain = new LLMChain({ llm, prompt: promptTemplate });

const generateQuizJson = async (userText: string): Promise<string> => {
    try {
        const jsonResult = await chain.call({
            userText,
            schema,
            example
        });

        return Promise.resolve(jsonResult.text);
    } catch (error) {
        return Promise.reject(error);
    }
};


export const alfred = {
    generateQuizJson
};

export default alfred;
