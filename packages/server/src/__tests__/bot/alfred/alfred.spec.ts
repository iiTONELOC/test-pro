import fs from 'fs';
import path from 'path';
import { expect, test, describe } from '@jest/globals';
import { alfred } from '../../../bot/alfred';


describe('Alfred', () => {
    test('It should be defined', () => {
        expect(alfred).toBeDefined();
    });
    test('It should be an object', () => {
        expect(typeof alfred).toBe('object');
    });
    test('It should have a generateQuizJson method', () => {
        expect(alfred.generateQuizJson).toBeDefined();
    });
    test('It should be a function', () => {
        expect(typeof alfred.generateQuizJson).toBe('function');
    });
    test('It should generate json for a given user text', async () => {
        const userText = fs.readFileSync(path.resolve(process.cwd(), './src/bot/alfred/schema/testUserInput.txt'), 'utf-8');
        const json = await alfred.generateQuizJson(userText);
        expect(json).toBeDefined();
        expect(typeof json).toBe('string');
        console.log('GENERATED DATA\n', json, '\nGENERATED DATA')
    });
});
