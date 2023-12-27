import path from 'path';
import { alfred } from '../../../bot';
import { quizType } from '../../../bot/types';
import { expect, test, describe } from '@jest/globals';
import { readTextFile } from '../../../bot/alfred/utils/parseQuestions';


describe('Alfred', () => {
    test('It should be defined', () => {
        expect(alfred).toBeDefined();
    });
    test('It should be an object', () => {
        expect(typeof alfred).toBe('object');
    });
    test('It should have a generateQuizJsonFromText method', () => {
        expect(alfred.generateQuizJsonFromText).toBeDefined();
    });
    test('It should be a function', () => {
        expect(typeof alfred.generateQuizJsonFromText).toBe('function');
    });
    test('It should generate the json data for a quiz from the U of A contained in a text file', async () => {
        const testFilePath = path.resolve(process.cwd(), './src/bot/alfred/utils/extractQuestionsFromText/testUserInputUA.txt');
        const testFile = await readTextFile(testFilePath);

        const json = await alfred.generateQuizJsonFromText(testFile);

        try {
            const jsonString = JSON.stringify(json, null, 4);
            // it should be valid json
            expect(typeof jsonString).toBe('string');
        } catch (error) {
            console.error(error);
        }

        expect.assertions(1);
    });
    test('It should generate the json data for a quiz from TestOut contained in a text file', async () => {
        const testFilePath = path.resolve(process.cwd(), './src/bot/alfred/utils/extractQuestionsFromText/testUserInputTestOut.txt');
        const testFile = await readTextFile(testFilePath);

        const json = await alfred.generateQuizJsonFromText(testFile, 'test-out' as quizType);
        try {
            const jsonString = JSON.stringify(json, null, 4);
            // it should be valid json
            expect(typeof jsonString).toBe('string');
        } catch (error) {
            console.error(error);
        }

        expect.assertions(1);
    });

});

