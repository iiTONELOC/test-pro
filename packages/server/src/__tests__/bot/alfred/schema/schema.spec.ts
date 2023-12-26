import { expect, test, describe } from '@jest/globals';
import { schema } from '../../../../bot/alfred/schema';
import example from '../../../../bot/alfred/schema/example.json';

describe('Schema', () => {
    test('It should be defined', () => {
        expect(schema).toBeDefined();
    });
    test('It should be a string', () => {
        expect(typeof schema).toBe('string');
    });
});

describe('Example', () => {
    test('It should be defined', () => {
        expect(example).toBeDefined();
    });
    test('It should be an object', () => {
        expect(typeof example).toBe('object');
    });
    test('It should be valid json', () => {
        expect(() => JSON.parse(JSON.stringify(example))).not.toThrow();
    });
});
