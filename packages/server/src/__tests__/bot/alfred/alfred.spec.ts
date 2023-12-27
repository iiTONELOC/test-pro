import path from 'path';
import { alfred } from '../../../bot';
import { quizType } from '../../../bot/types';
import { expect, test, describe } from '@jest/globals';


describe('Alfred', () => {
    test('It should be defined', () => {
        expect(alfred).toBeDefined();
    });
    test('It should be an object', () => {
        expect(typeof alfred).toBe('object');
    });
    test('It should have a generateQuizJsonFromTextFile method', () => {
        expect(alfred.generateQuizJsonFromTextFile).toBeDefined();
    });
    test('It should be a function', () => {
        expect(typeof alfred.generateQuizJsonFromTextFile).toBe('function');
    });
    test('It should generate the json data for a quiz from the U of A contained in a text file', async () => {
        const testFilePath = path.resolve(process.cwd(), './src/bot/alfred/utils/extractQuestionsFromText/testUserInputUA.txt');

        const json = await alfred.generateQuizJsonFromTextFile(testFilePath);
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

        const json = await alfred.generateQuizJsonFromTextFile(testFilePath, 'test-out' as quizType);
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

