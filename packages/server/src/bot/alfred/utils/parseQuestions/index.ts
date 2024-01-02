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
export const parseQuestionsUofA = (userText: string): Partial<parsedQuestionsType>[] => extractQuestionsFromText.UofA(userText);


export const parseQuestionsTestOut = (userText: string): Partial<parsedQuestionsType>[] => {
    userText = userText
        .replace(/Correct Answer:?/g, '')
        .replace(/Correct/g, '')
        .replace(/Answer:?/g, '')
    const extracted = extractQuestionsFromText.TestOut(userText);

    // clean up the areaToReview property, we need to remove empty strings and entries with underscores
    extracted.forEach(question => {
        question.areaToReview = question.areaToReview?.filter(area => area !== '' && !area.includes('_'));
    });
    return extracted
};

export const parseQuestions = {
    UofA: parseQuestionsUofA,
    TestOut: parseQuestionsTestOut
}

export default parseQuestions;
