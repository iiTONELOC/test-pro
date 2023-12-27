import { resolve } from 'path';
import { readFile } from 'fs/promises';
import { parsedQuestionsType } from './types';
import { extractQuestionsFromText } from '../extractQuestionsFromText';


/**
 * Read a text file as a promise
 *
 * @param pathToFile - the absolute path to the file
 * @returns - the text in the file
 */
export const readTextFile = async (pathToFile: string): Promise<string> => {
    try {
        const file = readFile(resolve(pathToFile), { encoding: 'utf-8' });
        return Promise.resolve(file);
    } catch (error: any) {
        console.error(error);
        return Promise.reject(error);
    }
};


/**
 * Parse questions from a user provided text file
 * @param userText  The user provided text
 * @returns        The parsed questions as an array of partial parsed questions
 */
export const parseQuestionsUofA = async (pathToFile: string): Promise<Partial<parsedQuestionsType>[]> => {
    const quizQuestionsText = await readTextFile(pathToFile);
    return extractQuestionsFromText.UofA(quizQuestionsText);
};

export const parseQuestionsTestOut = async (pathToFile: string): Promise<Partial<parsedQuestionsType>[]> => {
    const quizQuestionsText = await readTextFile(pathToFile);
    quizQuestionsText
        .replace(/Correct Answer:?/g, '')
        .replace(/Correct/g, '')
        .replace(/Answer:?/g, '')

    return extractQuestionsFromText.TestOut(quizQuestionsText);
};

export const parseQuestions = {
    UofA: parseQuestionsUofA,
    TestOut: parseQuestionsTestOut
}

export default parseQuestions;
