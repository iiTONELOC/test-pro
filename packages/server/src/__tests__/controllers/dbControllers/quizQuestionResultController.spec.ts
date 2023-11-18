import { expect, test, describe, beforeAll, afterAll } from '@jest/globals';
import { quizQuestionResultController } from '../../../controllers';
import { dbConnection, dbClose } from '../../../db/connection'
import { QuizQuestionResult } from '../../../db/models';
import { Types } from 'mongoose';

import type { IQuizQuestionResult, QuizQuestionResultType } from '../../../db/types';

beforeAll(async () => {
    await dbConnection(process.env.TEST_DB_NAME);
});

afterAll(async () => {
    await QuizQuestionResult.deleteMany({});
    await dbClose();
});

describe('QuizQuestionResultController', () => {
    test('It should be defined and contain all methods defined in the interface', () => {
        expect(quizQuestionResultController).toBeDefined();
        expect(quizQuestionResultController.create).toBeDefined();
        expect(quizQuestionResultController.getAll).toBeDefined();
        expect(quizQuestionResultController.getById).toBeDefined();
        expect(quizQuestionResultController.create).toBeDefined();
        expect(quizQuestionResultController.deleteById).toBeDefined();
    });

    describe('create()', () => {
        test('It should create a new quiz question result', async () => {
            const quizId = new Types.ObjectId();
            const questionId = new Types.ObjectId();
            const timeTakenInMs = 10000;

            const resultData: IQuizQuestionResult = {
                quizAttempt: quizId,
                question: questionId,
                selectedAnswer: 'A',
                isCorrect: true,
                elapsedTimeInMs: timeTakenInMs
            };

            const newQuizQuestionResult = await quizQuestionResultController.create(resultData);
            expect(newQuizQuestionResult).toBeDefined();
            expect(newQuizQuestionResult.quizAttempt.toString()).toBe(quizId.toString());
            expect(newQuizQuestionResult.question.toString()).toBe(questionId.toString());
            expect(newQuizQuestionResult.selectedAnswer).toBe('A');
            expect(newQuizQuestionResult.isCorrect).toBe(true);
        });

        test('It should throw an error if quizAttempt is not provided', async () => {
            const questionId = new Types.ObjectId();
            const timeTakenInMs = 10000;

            const resultData: IQuizQuestionResult = {
                // @ts-expect-error
                quizAttempt: null,
                question: questionId,
                selectedAnswer: 'A',
                isCorrect: true,
                elapsedTimeInMs: timeTakenInMs
            };

            try {
                await quizQuestionResultController.create(resultData);
            } catch (error: any) {
                expect(error).toBeDefined();
                expect(error.message).toBe('QuizQuestionResult validation failed: quizAttempt: Path `quizAttempt` is required.');
            }
        });

        test('It should throw an error if question is not provided', async () => {
            const quizId = new Types.ObjectId();
            const timeTakenInMs = 10000;

            const resultData: IQuizQuestionResult = {
                quizAttempt: quizId,
                // @ts-expect-error
                question: null,
                selectedAnswer: 'A',
                isCorrect: true,
                elapsedTimeInMs: timeTakenInMs
            };

            try {
                await quizQuestionResultController.create(resultData);
            } catch (error: any) {
                expect(error).toBeDefined();
                expect(error.message).toBe('QuizQuestionResult validation failed: question: Path `question` is required.');
            }
        });

        test('It should throw an error if selectedAnswer is not provided', async () => {
            const quizId = new Types.ObjectId();
            const questionId = new Types.ObjectId();
            const timeTakenInMs = 10000;

            const resultData: IQuizQuestionResult = {
                quizAttempt: quizId,
                question: questionId,
                // @ts-expect-error
                selectedAnswer: null,
                isCorrect: true,
                elapsedTimeInMs: timeTakenInMs
            };

            try {
                await quizQuestionResultController.create(resultData);
            } catch (error: any) {
                expect(error).toBeDefined();
                expect(error.message).toBe('QuizQuestionResult validation failed: selectedAnswer: Path `selectedAnswer` is required.');
            }
        });

        test('It should throw an error if isCorrect is not provided', async () => {
            const quizId = new Types.ObjectId();
            const questionId = new Types.ObjectId();
            const timeTakenInMs = 10000;

            const resultData: IQuizQuestionResult = {
                quizAttempt: quizId,
                question: questionId,
                selectedAnswer: 'A',
                // @ts-expect-error
                isCorrect: null,
                elapsedTimeInMs: timeTakenInMs
            };

            try {
                await quizQuestionResultController.create(resultData);
            } catch (error: any) {
                expect(error).toBeDefined();
                expect(error.message).toBe('QuizQuestionResult validation failed: isCorrect: Path `isCorrect` is required.');
            }
        });

        test('It should throw an error if elapsedTimeInMs is not provided', async () => {
            const quizId = new Types.ObjectId();
            const questionId = new Types.ObjectId();

            const resultData: IQuizQuestionResult = {
                quizAttempt: quizId,
                question: questionId,
                selectedAnswer: 'A',
                isCorrect: true,
                // @ts-expect-error
                elapsedTimeInMs: null
            };

            try {
                await quizQuestionResultController.create(resultData);
            } catch (error: any) {
                expect(error).toBeDefined();
                expect(error.message).toBe('QuizQuestionResult validation failed: elapsedTimeInMs: Path `elapsedTimeInMs` is required.');
            }
        });
    });

    describe('getAll()', () => {
        test('It should return an array of quiz question results', async () => {
            const quizQuestionResults = await quizQuestionResultController.getAll();
            expect(quizQuestionResults).toBeDefined();
            expect(quizQuestionResults.length).toBe(1);
        });
    });

    describe('getById()', () => {
        test('It should return a quiz question result by id', async () => {
            const quizQuestionResult = await quizQuestionResultController.create({
                quizAttempt: new Types.ObjectId(),
                question: new Types.ObjectId(),
                selectedAnswer: 'F',
                isCorrect: false,
                elapsedTimeInMs: 10000
            });

            const result: QuizQuestionResultType | null = await quizQuestionResultController.getById(quizQuestionResult._id.toString());
            expect(result).toBeDefined();
            expect(result?.selectedAnswer).toBe('F');
            expect(result?.isCorrect).toBe(false);
            expect(result?.elapsedTimeInMs).toBe(10000);
        });

        test('It should return null if quiz question result is not found', async () => {
            const result: QuizQuestionResultType | null = await quizQuestionResultController.getById(new Types.ObjectId().toString());
            expect(result).toBeNull();
        });
    });

    describe('deleteById()', () => {
        test('It should delete a quiz question result by id', async () => {
            const quizQuestionResult = await quizQuestionResultController.create({
                quizAttempt: new Types.ObjectId(),
                question: new Types.ObjectId(),
                selectedAnswer: 'F',
                isCorrect: false,
                elapsedTimeInMs: 10000
            });

            const result: QuizQuestionResultType | null = await quizQuestionResultController.deleteById(quizQuestionResult._id.toString());

            expect(result).toBeDefined();
            expect(result?.selectedAnswer).toBe('F');
            expect(result?.isCorrect).toBe(false);
            expect(result?.elapsedTimeInMs).toBe(10000);
            expect(result?._id.toString()).toBe(quizQuestionResult._id.toString());
        });

        test('It should return null if quiz question result is not found', async () => {
            const result: QuizQuestionResultType | null = await quizQuestionResultController.deleteById(new Types.ObjectId().toString());
            expect(result).toBeNull();
        });
    });
});

