import { expect, test, describe, beforeAll, afterAll } from 'bun:test';
import { dbQueryParamDefaults } from '../../../controllers/routeControllers/routeUtils';
import { quizAttemptController } from '../../../controllers';
import { dbConnection, dbClose } from '../../../db/connection'
import { QuizAttempt, QuizQuestionResult } from '../../../db/models';
import { Types } from 'mongoose';

import type { IQuizAttempt, QuizAttemptType } from '../../../db/types';


beforeAll(async () => {
    await dbConnection(process.env.TEST_DB_NAME);
});

afterAll(async () => {
    await QuizAttempt.deleteMany({});
    await dbClose();
});

describe('quizAttemptController', () => {
    test('It should be defined and contain all the methods defined in the interface', () => {
        expect(quizAttemptController).toBeDefined();
        expect(quizAttemptController).toHaveProperty('create');
        expect(quizAttemptController).toHaveProperty('getAll');
        expect(quizAttemptController).toHaveProperty('getById');
        expect(quizAttemptController).toHaveProperty('updateById');
        expect(quizAttemptController).toHaveProperty('deleteById');
    });

    describe('create', () => {
        test('It should create a new quizAttempt', async () => {
            const quizAttemptData: IQuizAttempt = {
                quizId: new Types.ObjectId(),
                answeredQuestions: [],
                earnedPoints: 0,
                passingPoints: 0,
                passed: false,
                dateTaken: new Date(),
                elapsedTimeInMs: 0
            };

            const quizAttempt: QuizAttemptType | null = await quizAttemptController.create(quizAttemptData, dbQueryParamDefaults);

            expect(quizAttempt).toBeDefined();
            expect(quizAttempt).toHaveProperty('_id');
            expect(quizAttempt?.answeredQuestions).toHaveLength(0);
            expect(quizAttempt?.earnedPoints).toBe(0);
            expect(quizAttempt?.passingPoints).toBe(0);
            expect(quizAttempt?.passed).toBe(false);
            expect(quizAttempt?.dateTaken).toBeInstanceOf(Date);
            expect(quizAttempt?.elapsedTimeInMs).toBe(0);
        });

        test('It should throw and error if quizId is not provided', async () => {
            const quizAttemptData: IQuizAttempt = {
                // @ts-expect-error
                quizId: null,
                answeredQuestions: [],
                earnedPoints: 0,
                passingPoints: 0,
                passed: false,
                dateTaken: new Date(),
                elapsedTimeInMs: 0
            };

            try {
                await quizAttemptController.create(quizAttemptData, dbQueryParamDefaults);
            } catch (error: any) {
                expect(error).toBeDefined();
                expect(error).toBeInstanceOf(Error);
                expect(error.message).toBe('QuizAttempt validation failed: quizId: Path `quizId` is required.');
            }
        });

        test('It should throw and error if answeredQuestions is not provided', async () => {
            const quizAttemptData: IQuizAttempt = {
                quizId: new Types.ObjectId(),
                // @ts-expect-error
                answeredQuestions: null,
                earnedPoints: 0,
                passingPoints: 0,
                passed: false,
                dateTaken: new Date(),
                elapsedTimeInMs: 0
            };

            try {
                await quizAttemptController.create(quizAttemptData, dbQueryParamDefaults);
            } catch (error: any) {
                expect(error).toBeDefined();
                expect(error).toBeInstanceOf(Error);
                expect(error.message).toBe('An array of answered questions must be provided.');
            }
        });

        test('It should throw and error if earnedPoints is not provided', async () => {
            const quizAttemptData: IQuizAttempt = {
                quizId: new Types.ObjectId(),
                answeredQuestions: [],
                // @ts-expect-error
                earnedPoints: null,
                passingPoints: 0,
                passed: false,
                dateTaken: new Date(),
                elapsedTimeInMs: 0
            };

            try {
                await quizAttemptController.create(quizAttemptData, dbQueryParamDefaults);
            } catch (error: any) {
                expect(error).toBeDefined();
                expect(error).toBeInstanceOf(Error);
                expect(error.message).toBe('QuizAttempt validation failed: earnedPoints: Path `earnedPoints` is required.');
            }
        });

        test('It should throw and error if passingPoints is not provided', async () => {
            const quizAttemptData: IQuizAttempt = {
                quizId: new Types.ObjectId(),
                answeredQuestions: [],
                earnedPoints: 0,
                // @ts-expect-error
                passingPoints: null,
                passed: false,
                dateTaken: new Date(),
                elapsedTimeInMs: 0
            };

            try {
                await quizAttemptController.create(quizAttemptData, dbQueryParamDefaults);
            } catch (error: any) {
                expect(error).toBeDefined();
                expect(error).toBeInstanceOf(Error);
                expect(error.message).toBe('QuizAttempt validation failed: passingPoints: Path `passingPoints` is required.');
            }
        });

        test('It should throw and error if passed is not provided', async () => {
            const quizAttemptData: IQuizAttempt = {
                quizId: new Types.ObjectId(),
                answeredQuestions: [],
                earnedPoints: 0,
                passingPoints: 0,
                // @ts-expect-error
                passed: null,
                dateTaken: new Date(),
                elapsedTimeInMs: 0
            };

            try {
                await quizAttemptController.create(quizAttemptData, dbQueryParamDefaults);
            } catch (error: any) {
                expect(error).toBeDefined();
                expect(error).toBeInstanceOf(Error);
                expect(error.message).toBe('QuizAttempt validation failed: passed: Path `passed` is required.');
            }
        });

        test('It should throw and error if dateTaken is not provided', async () => {
            const quizAttemptData: IQuizAttempt = {
                quizId: new Types.ObjectId(),
                answeredQuestions: [],
                earnedPoints: 0,
                passingPoints: 0,
                passed: false,
                // @ts-expect-error
                dateTaken: null,
                elapsedTimeInMs: 0
            };

            try {
                await quizAttemptController.create(quizAttemptData, dbQueryParamDefaults);
            } catch (error: any) {
                expect(error).toBeDefined();
                expect(error).toBeInstanceOf(Error);
                expect(error.message).toBe('QuizAttempt validation failed: dateTaken: Path `dateTaken` is required.');
            }
        });

        test('It should throw and error if elapsedTimeInMs is not provided', async () => {
            const quizAttemptData: IQuizAttempt = {
                quizId: new Types.ObjectId(),
                answeredQuestions: [],
                earnedPoints: 0,
                passingPoints: 0,
                passed: false,
                dateTaken: new Date(),
                // @ts-expect-error
                elapsedTimeInMs: null
            };

            try {
                await quizAttemptController.create(quizAttemptData, dbQueryParamDefaults);
            } catch (error: any) {
                expect(error).toBeDefined();
                expect(error).toBeInstanceOf(Error);
                expect(error.message).toBe('QuizAttempt validation failed: elapsedTimeInMs: Path `elapsedTimeInMs` is required.');
            }
        });
    });

    describe('getAll', () => {
        test('It should return an array of quizAttempts', async () => {
            const quizAttempts: QuizAttemptType[] = await quizAttemptController.getAll(dbQueryParamDefaults);
            expect(quizAttempts).toBeDefined();
            expect(quizAttempts).toBeInstanceOf(Array);
            expect(quizAttempts).toHaveLength(1);
        });
    });

    describe('getById', () => {
        test('It should return a quizAttempt by ID if it exists', async () => {
            const quizId = await quizAttemptController.getAll(dbQueryParamDefaults).then((quizAttempts: QuizAttemptType[]) => {
                if (quizAttempts.length) {
                    return quizAttempts[0]._id;
                }

                return null;
            });

            const quizAttempt: QuizAttemptType | null = await quizAttemptController.getById(quizId as unknown as string, dbQueryParamDefaults);

            expect(quizAttempt).toBeDefined();
            expect(quizAttempt).toBeInstanceOf(Object);
            expect(quizAttempt).toHaveProperty('_id');
            expect(quizAttempt).toHaveProperty('quizId');
            expect(quizAttempt).toHaveProperty('answeredQuestions');
            expect(quizAttempt).toHaveProperty('earnedPoints');
            expect(quizAttempt).toHaveProperty('passingPoints');
            expect(quizAttempt).toHaveProperty('passed');
            expect(quizAttempt).toHaveProperty('dateTaken');
            expect(quizAttempt).toHaveProperty('elapsedTimeInMs');
            expect(quizAttempt?._id.toString()).toBe(quizId?.toString());
        });

        test('It should return null if quizAttempt does not exist', async () => {
            const quizAttempt: QuizAttemptType | null = await quizAttemptController.getById(new Types.ObjectId().toString(), dbQueryParamDefaults);

            expect(quizAttempt).toBeNull();
        });
    });


    describe('updateById', () => {
        test('It should update a quizAttempt by ID if it exists', async () => {
            const quizId = await quizAttemptController.getAll(dbQueryParamDefaults).then((quizAttempts: QuizAttemptType[]) => {
                if (quizAttempts.length) {
                    return quizAttempts[0]._id;
                }

                return null;
            });

            const quizAttemptData: Partial<IQuizAttempt> = {
                earnedPoints: 55,
                passingPoints: 35,
                passed: true
            };

            const updatedQuizAttempt: QuizAttemptType | null = await quizAttemptController.updateById(
                quizId as unknown as string, quizAttemptData, dbQueryParamDefaults);

            expect(updatedQuizAttempt).toBeDefined();
            expect(updatedQuizAttempt).toBeInstanceOf(Object);
            expect(updatedQuizAttempt?.earnedPoints).toBe(55);
            expect(updatedQuizAttempt?.passingPoints).toBe(35);
            expect(updatedQuizAttempt?.passed).toBe(true);
        });

        test('It should return null if quizAttempt does not exist', async () => {
            const quizAttemptData: Partial<IQuizAttempt> = {
                earnedPoints: 55,
                passingPoints: 35,
                passed: true
            };

            const updatedQuizAttempt: QuizAttemptType | null = await quizAttemptController.updateById(
                new Types.ObjectId().toString(), quizAttemptData, dbQueryParamDefaults);

            expect(updatedQuizAttempt).toBeNull();
        });
    });

    describe('deleteById', () => {
        test('It should delete a quizAttempt by ID if it exists', async () => {
            const quizId = await quizAttemptController.getAll(dbQueryParamDefaults).then((quizAttempts: QuizAttemptType[]) => {
                if (quizAttempts.length) {
                    return quizAttempts[0]._id;
                }

                return null;
            });

            const deletedQuizAttempt: QuizAttemptType | null = await quizAttemptController.deleteById(quizId as unknown as string);

            expect(deletedQuizAttempt).toBeDefined();
            expect(deletedQuizAttempt).toBeInstanceOf(Object);
            expect(deletedQuizAttempt?._id.toString()).toBe(quizId?.toString());
            // the quizQuestion results should also be deleted not just removed when the quizAttempt is deleted
            expect(await QuizQuestionResult.find({ quizAttempt: quizId })).toHaveLength(0);
        });

        test('It should return null if quizAttempt does not exist', async () => {
            const deletedQuizAttempt: QuizAttemptType | null = await quizAttemptController.deleteById(new Types.ObjectId().toString());

            expect(deletedQuizAttempt).toBeNull();
        });
    });
});
