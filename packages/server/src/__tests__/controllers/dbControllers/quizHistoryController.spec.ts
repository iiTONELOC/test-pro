import { expect, test, describe, beforeAll, afterAll } from 'bun:test';
import { Topic, Question, Quiz, QuizAttempt, QuizQuestionResult, QuizHistory, QuestionTypeEnums } from '../../../db/models';
import { quizHistoryController } from '../../../controllers/dbControllers';
import { dbConnection, dbClose } from '../../../db/connection';
import { Types } from 'mongoose';

import type { IQuestion, IQuiz, ITopic, IQuizAttempt, IQuizQuestionResult, PopulatedQuizHistoryType } from '../../../db/types';

// we need to create a topic, question, quiz, quizAttempt, quizQuestionResult so we can test the quizHistoryController

const testTopicData: ITopic = {
    name: 'test topic'
};

const testQuestionData: IQuestion = {
    question: 'test question',
    answer: 'test answer',
    topics: [],
    questionType: QuestionTypeEnums.MultipleChoice,
    options: ['test answer', 'test option 2', 'test option 3', 'test option 4'],
    explanation: 'test explanation',
    areaToReview: ['test area to review']
};

const testQuizData: IQuiz = {
    name: 'test quiz',
    questions: [],
    topics: []
};

const answeredQuestionData: IQuizQuestionResult = {
    // @ts-expect-error
    quizAttempt: null,
    // @ts-expect-error
    question: null,
    selectedAnswer: 'test answer',
    isCorrect: true
};

const attemptedQuizData: IQuizAttempt = {
    // @ts-expect-error
    quizId: null,
    answeredQuestions: [],
    earnedPoints: 0,
    passingPoints: 0,
    passed: false,
    dateTaken: new Date(),
    elapsedTimeInMs: 0
};

let quizAttemptId: Types.ObjectId | null = null;
let quizHistoryId: Types.ObjectId | null = null;

const createNeededDbEntries = async () => {
    // create a topic and add its id to where it's needed
    const testTopic = await Topic.create(testTopicData);
    testQuestionData.topics.push(testTopic._id);
    testQuizData.topics.push(testTopic._id);

    // create a question and add its id to where it's needed
    const testQuestion = await Question.create(testQuestionData);
    testQuizData.questions.push(testQuestion._id);
    answeredQuestionData.question = testQuestion._id;

    // create a quiz and add its id to where it's needed
    const testQuiz = await Quiz.create(testQuizData);
    attemptedQuizData.quizId = testQuiz._id;

    // create a quizAttempt and add its id to where it's needed
    const testQuizAttempt = await QuizAttempt.create(attemptedQuizData);
    answeredQuestionData.quizAttempt = testQuizAttempt._id;
    quizAttemptId = testQuizAttempt._id;
};

beforeAll(async () => {
    await dbConnection(process.env.TEST_DB_NAME)
        .then(async () => await createNeededDbEntries());
});

afterAll(async () => {
    await Promise.all([
        Topic.deleteMany({}),
        Question.deleteMany({}),
        Quiz.deleteMany({}),
        QuizAttempt.deleteMany({}),
        QuizQuestionResult.deleteMany({}),
        QuizHistory.deleteMany({})
    ]).then(async () => await dbClose());
});

describe('quizHistoryController', () => {
    test('It should be defined and have all the methods described in the interface', () => {
        expect(quizHistoryController).toBeDefined();
        expect(quizHistoryController.getAll).toBeDefined();
        expect(quizHistoryController.create).toBeDefined();
        expect(quizHistoryController.getById).toBeDefined();
        expect(quizHistoryController.deleteById).toBeDefined();
    });

    describe('create', () => {
        test('It should create a quizHistory', async () => {
            const id = quizAttemptId as Types.ObjectId;
            const quizHistory = await quizHistoryController.create({
                attempt: id
            }, {
                showTimestamps: false,
                needToPopulate: true
            }) as PopulatedQuizHistoryType;

            quizHistoryId = quizHistory._id;

            expect(quizHistory).toBeDefined();
            expect(quizHistory?.attempt?._id).toEqual(quizAttemptId as Types.ObjectId);
            expect(quizHistory?.attempt?.quizId).toEqual(attemptedQuizData.quizId);
            expect(quizHistory?.attempt?.answeredQuestions).toEqual(attemptedQuizData.answeredQuestions);
        });

        test('It should throw an error if the quizAttempt id is not provided', async () => {
            try {
                await quizHistoryController.create({
                    // @ts-expect-error
                    attempt: null
                }, {
                    showTimestamps: false,
                    needToPopulate: false
                });
            } catch (error: any) {
                expect(error).toBeDefined();
                expect(error.message).toEqual('A Quiz attempt is required');
            }
        });

        test('It should throw an error if the quizAttempt id is not a valid ObjectId', async () => {
            try {
                await quizHistoryController.create({
                    // @ts-expect-error
                    attempt: 'invalid id'
                }, {
                    showTimestamps: false,
                    needToPopulate: false
                });
            } catch (error: any) {
                expect(error).toBeDefined();
                expect(error.message).toInclude('Cast to ObjectId failed');
            }
        });

        test('It should throw an error if the quizAttempt id is not found', async () => {
            try {
                await quizHistoryController.create({
                    attempt: new Types.ObjectId()
                }, {
                    showTimestamps: false,
                    needToPopulate: false
                });
            } catch (error: any) {
                expect(error).toBeDefined();
                expect(error.message).toEqual('QuizAttempt not found');
            }
        });
    });

    describe('getAll', () => {
        test('It should get all quizHistories', async () => {
            const quizHistories = await quizHistoryController.getAll({
                showTimestamps: false,
                needToPopulate: false
            });

            expect(quizHistories).toBeDefined();
            expect(quizHistories?.length).toEqual(1);
        });
    });

    describe('getById', async () => {
        test('It should get a quizHistory by id', async () => {
            const id = quizHistoryId as Types.ObjectId;

            const quizHistory = await quizHistoryController.getById(id.toString(), {
                showTimestamps: false,
                needToPopulate: false
            });

            expect(quizHistory).toBeDefined();
            expect(quizHistory?.attempt).toEqual(quizAttemptId as Types.ObjectId);
        });

        test('It should throw an error if the id is not a valid ObjectId', async () => {
            const id = 'invalid id';
            let didError = false;
            try {
                await quizHistoryController.getById(id, {
                    showTimestamps: false,
                    needToPopulate: false
                });
            } catch (error: any) {
                expect(error).toBeDefined();
                expect(error.message).toInclude('Cast to ObjectId failed');
                didError = true;
            }
            expect(didError).toBeTruthy();
        });

        test('It should return null if the id is not found', async () => {
            const id = new Types.ObjectId();
            let didError = false;
            try {
                const history = await quizHistoryController.getById(id.toString(), {
                    showTimestamps: false,
                    needToPopulate: false
                });
                expect(history).toBeNull();
            } catch (error: any) {
                expect(error).toBeDefined();
                expect(error.message).toEqual('QuizHistory not found');
                didError = true;
            }
            expect(didError).toBeFalsy();
        });
    });

    describe('deleteById', () => {
        test('It should delete a quizHistory by id', async () => {
            const id = quizHistoryId as Types.ObjectId;
            const deletedQuizHistory = await quizHistoryController.deleteById(id.toString(), {
                showTimestamps: false,
                needToPopulate: false
            });
            expect(deletedQuizHistory).toBeDefined();
            expect(deletedQuizHistory?._id).toEqual(id);
            expect(deletedQuizHistory?.attempt).toEqual(quizAttemptId as Types.ObjectId);
        });

        test('It should throw an error if the id is not a valid ObjectId', async () => {
            const id = 'invalid id';
            let didError = false;
            try {
                await quizHistoryController.deleteById(id, {
                    showTimestamps: false,
                    needToPopulate: false
                });
            } catch (error: any) {
                expect(error).toBeDefined();
                expect(error.message).toInclude('Cast to ObjectId failed');
                didError = true;
            }
            expect(didError).toBeTruthy();
        });

        test('It should return null if the id is not found', async () => {
            const id = new Types.ObjectId();
            let didError = false;
            try {
                const deletedQuizHistory = await quizHistoryController.deleteById(id.toString(), {
                    showTimestamps: false,
                    needToPopulate: false
                });
                expect(deletedQuizHistory).toBeNull();
            } catch (error: any) {
                expect(error).toBeDefined();
                expect(error.message).toEqual('QuizHistory not found');
                didError = true;
            }
            expect(didError).toBeFalsy();
        });
    });
});
