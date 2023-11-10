import { afterAll, beforeAll, expect, test, describe } from 'bun:test';
import { dbConnection, dbClose } from '../../../db/connection';
import { IApiResponse } from '../../../controllers/types';
import { Question, Topic } from '../../../db/models';
import { startServer } from '../../../server';
import { Types } from 'mongoose';

import type { PopulatedQuestionModelType, QuestionTypeEnums } from '../../../db/types';

const PORT = 3002;

let question: PopulatedQuestionModelType | null = null;

beforeAll(async () => {
    process.env.PORT = PORT.toString();
    await dbConnection(process.env.DB_TEST_NAME).then(async () => {
        await startServer();
    });
});

afterAll(async () => {
    await Question.deleteMany({});
    await Topic.deleteMany({});
    await dbClose();
    question = null;
});

describe('Question Routes', () => {
    describe('POST /api/questions', async () => {
        test('Create a question', async () => {
            const testTopic = await Topic.create({ name: 'TestTopic' });
            const questionData = {
                questionType: 'MultipleChoice' as QuestionTypeEnums,
                question: 'What is the capital of Texas?',
                topics: [testTopic._id.toString()],
                options: ['Austin', 'Dallas', 'Houston', 'San Antonio'],
                answer: 'Austin',
                explanation: 'Austin is the capital of Texas',
                areaToReview: ['geography']
            }

            const response: Response = await fetch(`http://localhost:${PORT}/api/questions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(questionData)
            });

            const questionResponse: IApiResponse<PopulatedQuestionModelType> = await response.json() as IApiResponse<PopulatedQuestionModelType>;

            question = questionResponse.data as PopulatedQuestionModelType;

            expect(response.status).toBe(201);
            expect(questionResponse.data?.question).toBe('What is the capital of Texas?');
            expect(questionResponse.data?.topics[0].name).toBe('TestTopic');
            expect(questionResponse.data?.options[0]).toBe('Austin');
            expect(questionResponse.data?.answer).toBe('Austin');
            expect(questionResponse.data?.explanation).toBe('Austin is the capital of Texas');
            expect(questionResponse.data?.areaToReview[0]).toBe('geography');
        });


        test('It should return an error if the data passed in is invalid', async () => {
            const questionData = {
                questionType: 'multipleChoice' as QuestionTypeEnums,
                question: 'What is the capital of Texas?',
                topics: ['123'],
                options: ['Austin', 'Dallas', 'Houston', 'San Antonio'],
                answer: 'Austin',
                explanation: 'Austin is the capital of Texas',
                areaToReview: ['geography']
            }

            const response: Response = await fetch(`http://localhost:${PORT}/api/questions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(questionData)
            });

            const questionResponse: IApiResponse<PopulatedQuestionModelType> = await response.json() as IApiResponse<PopulatedQuestionModelType>;

            expect(response.status).toBe(400);
            expect(questionResponse.error).toBeDefined();
        });

        test('It should return unpopulated if the no-populate query param is passed in', async () => {
            const testTopic = await Topic.findOne({ name: 'TestTopic' });
            const questionData = {
                questionType: 'MultipleChoice' as QuestionTypeEnums,
                question: 'What is the capital of California?',
                topics: [testTopic?._id.toString()],
                options: ['Sacramento', 'San Francisco', 'Cupertino', 'Los Gatos'],
                answer: 'Sacramento',
                explanation: 'Sacramento is the capital of California',
                areaToReview: ['geography']
            }

            const response: Response = await fetch(`http://localhost:${PORT}/api/questions?no-populate=true`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(questionData)
            });

            const questionResponse: IApiResponse<PopulatedQuestionModelType> = await response.json() as IApiResponse<PopulatedQuestionModelType>;

            expect(response.status).toBe(201);
            expect(questionResponse.data?.question).toBe('What is the capital of California?');
            // @ts-ignore
            expect(questionResponse.data?.topics[0]).toBe(testTopic?._id.toString());
        });

        test('It should return timestamps if the timestamps query param is passed in', async () => {
            const testTopic = await Topic.findOne({ name: 'TestTopic' });
            const questionData = {
                questionType: 'MultipleChoice' as QuestionTypeEnums,
                question: 'What is the capital of Georgia?',
                topics: [testTopic?._id.toString()],
                options: ['Macon', 'Savannah', 'Atlanta', 'Perry'],
                answer: 'Atlanta',
                explanation: 'Atlanta is the capital of Georgia',
                areaToReview: ['geography']
            }

            const response: Response = await fetch(`http://localhost:${PORT}/api/questions?timestamps=true`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(questionData)
            });

            const questionResponse: IApiResponse<PopulatedQuestionModelType> = await response.json() as IApiResponse<PopulatedQuestionModelType>;

            expect(response.status).toBe(201);
            expect(questionResponse.data?.question).toBe('What is the capital of Georgia?');
            expect(questionResponse.data?.createdAt).toBeDefined();
            expect(questionResponse.data?.updatedAt).toBeDefined();
        });
    });

    describe('GET /api/questions', async () => {
        test('Get all questions', async () => {
            const response: Response = await fetch(`http://localhost:${PORT}/api/questions`);
            const questions: IApiResponse<PopulatedQuestionModelType[]> = await response.json() as IApiResponse<PopulatedQuestionModelType[]>;

            expect(response.status).toBe(200);
            expect(questions.data?.length).toBe(3);
        });

        test('It should return unpopulated if the no-populate query param is passed in', async () => {
            const response: Response = await fetch(`http://localhost:${PORT}/api/questions?no-populate=true`);
            const questions: IApiResponse<PopulatedQuestionModelType[]> = await response.json() as IApiResponse<PopulatedQuestionModelType[]>;

            expect(response.status).toBe(200);
            expect(questions.data?.[0]?.topics[0]).toBeDefined();
            expect(questions.data?.[0]?.topics[0]?.name).toBeUndefined();
        });

        test('It should return timestamps if the timestamps query param is passed in', async () => {
            const response: Response = await fetch(`http://localhost:${PORT}/api/questions?timestamps=true`);
            const questions: IApiResponse<PopulatedQuestionModelType[]> = await response.json() as IApiResponse<PopulatedQuestionModelType[]>;

            expect(response.status).toBe(200);
            expect(questions.data?.[0].createdAt).toBeDefined();
            expect(questions.data?.[0].updatedAt).toBeDefined();
        });
    });

    describe('GET /api/questions/:questionId', async () => {
        test('Get a question by id', async () => {
            const response: Response = await fetch(`http://localhost:${PORT}/api/questions/${question?._id}`);
            const questionResponse: IApiResponse<PopulatedQuestionModelType> = await response.json() as IApiResponse<PopulatedQuestionModelType>;

            expect(response.status).toBe(200);
            expect(questionResponse.data?.question).toBe('What is the capital of Texas?');
        });

        test('It should return a 404 if no question is found', async () => {
            const response: Response = await fetch(`http://localhost:${PORT}/api/questions/${new Types.ObjectId()}`);
            expect(response.status).toBe(404);
        });

        test('It should return unpopulated if the no-populate query param is passed in', async () => {
            const response: Response = await fetch(`http://localhost:${PORT}/api/questions/${question?._id}?no-populate=true`);
            const questionResponse: IApiResponse<PopulatedQuestionModelType> = await response.json() as IApiResponse<PopulatedQuestionModelType>;

            expect(response.status).toBe(200);
            expect(questionResponse.data?.topics[0]).toBeDefined();
            expect(questionResponse.data?.topics[0]?.name).toBeUndefined();
        });

        test('It should return timestamps if the timestamps query param is passed in', async () => {
            const response: Response = await fetch(`http://localhost:${PORT}/api/questions/${question?._id}?timestamps=true`);
            const questionResponse: IApiResponse<PopulatedQuestionModelType> = await response.json() as IApiResponse<PopulatedQuestionModelType>;

            expect(response.status).toBe(200);
            expect(questionResponse.data?.createdAt).toBeDefined();
            expect(questionResponse.data?.updatedAt).toBeDefined();
        });
    });


    describe('PUT /api/questions/:questionId', async () => {
        test('Update a question', async () => {
            const questionData = {
                questionType: 'MultipleChoice' as QuestionTypeEnums,
                question: 'What is the capital of Florida?',
                topics: [new Types.ObjectId()],
                options: ['Tallahassee', 'Orlando', 'Dallas', 'Miami'],
                answer: 'Tallahassee',
                explanation: 'Tallahassee is the capital of Florida',
                areaToReview: ['geography']
            }

            const response: Response = await fetch(`http://localhost:${PORT}/api/questions/${question?._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(questionData)
            });

            const questionResponse: IApiResponse<PopulatedQuestionModelType> = await response.json() as IApiResponse<PopulatedQuestionModelType>;

            expect(response.status).toBe(200);
            expect(questionResponse.data?.question).toBe('What is the capital of Florida?');
            expect(questionResponse.data?.options[0]).toBe('Tallahassee');
            expect(questionResponse.data?.answer).toBe('Tallahassee');
            expect(questionResponse.data?.explanation).toBe('Tallahassee is the capital of Florida');
            expect(questionResponse.data?.areaToReview[0]).toBe('geography');
        });

        test('It should return a 404 if no question is found', async () => {
            const response: Response = await fetch(`http://localhost:${PORT}/api/questions/${new Types.ObjectId()}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    questionType: 'MultipleChoice',
                    question: 'What is the capital of Florida?',
                    topics: [new Types.ObjectId()],
                    options: ['Tallahassee', 'Orlando', 'Dallas', 'Miami'],
                    answer: 'Tallahassee',
                    explanation: 'Tallahassee is the capital of Florida',
                    areaToReview: ['geography']
                })
            });

            expect(response.status).toBe(404);
        });

        test('It should return unpopulated if the no-populate query param is passed in', async () => {
            const response: Response = await fetch(`http://localhost:${PORT}/api/questions/${question?._id}?no-populate=true`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    questionType: 'MultipleChoice',
                    question: 'What is the capital of Florida?',
                    topics: [new Types.ObjectId()],
                    options: ['Tallahassee', 'Orlando', 'Dallas', 'Miami'],
                    answer: 'Tallahassee',
                    explanation: 'Tallahassee is the capital of Florida',
                    areaToReview: ['geography']
                })
            });

            const questionResponse: IApiResponse<PopulatedQuestionModelType> = await response.json() as IApiResponse<PopulatedQuestionModelType>;

            expect(response.status).toBe(200);
            expect(questionResponse.data?.topics[0]).toBeDefined();
            expect(questionResponse.data?.topics[0]?.name).toBeUndefined();
        });

        test('It should return timestamps if the timestamps query param is passed in', async () => {
            const response: Response = await fetch(`http://localhost:${PORT}/api/questions/${question?._id}?timestamps=true`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    questionType: 'MultipleChoice',
                    question: 'What is the capital of Florida?',
                    topics: [new Types.ObjectId()],
                    options: ['Tallahassee', 'Orlando', 'Dallas', 'Miami'],
                    answer: 'Tallahassee',
                    explanation: 'Tallahassee is the capital of Florida',
                    areaToReview: ['geography']
                })
            });

            const questionResponse: IApiResponse<PopulatedQuestionModelType> = await response.json() as IApiResponse<PopulatedQuestionModelType>;

            expect(response.status).toBe(200);
            expect(questionResponse.data?.createdAt).toBeDefined();
            expect(questionResponse.data?.updatedAt).toBeDefined();
        });
    });

    describe('DELETE /api/questions/:questionId', async () => {
        test('Delete a question', async () => {
            const response: Response = await fetch(`http://localhost:${PORT}/api/questions/${question?._id}`, {
                method: 'DELETE'
            });

            const questionResponse: IApiResponse<PopulatedQuestionModelType> = await response.json() as IApiResponse<PopulatedQuestionModelType>;

            expect(response.status).toBe(200);
            expect(questionResponse.data?.question).toBe('What is the capital of Florida?');
        });

        test('It should return a 404 if no question is found', async () => {
            const response: Response = await fetch(`http://localhost:${PORT}/api/questions/${new Types.ObjectId()}`, {
                method: 'DELETE'
            });

            expect(response.status).toBe(404);
        });

        test('It should return unpopulated if the no-populate query param is passed in', async () => {
            const question = await Question.create({
                questionType: 'MultipleChoice' as QuestionTypeEnums,
                question: 'What is the capital of Florida?',
                topics: [new Types.ObjectId()],
                options: ['Tallahassee', 'Orlando', 'Dallas', 'Miami'],
                answer: 'Tallahassee',
                explanation: 'Tallahassee is the capital of Florida',
                areaToReview: ['geography']
            });

            const response: Response = await fetch(`http://localhost:${PORT}/api/questions/${question?._id}?no-populate=true`, {
                method: 'DELETE'
            });

            const questionResponse: IApiResponse<PopulatedQuestionModelType> = await response.json() as IApiResponse<PopulatedQuestionModelType>;

            expect(response.status).toBe(200);
            expect(questionResponse.data?.topics[0]).toBeDefined();
            expect(questionResponse.data?.topics[0]?.name).toBeUndefined();
        });

        test('It should return timestamps if the timestamps query param is passed in', async () => {
            const question = await Question.create({
                questionType: 'MultipleChoice' as QuestionTypeEnums,
                question: 'What is the capital of Florida?',
                topics: [new Types.ObjectId()],
                options: ['Tallahassee', 'Orlando', 'Dallas', 'Miami'],
                answer: 'Tallahassee',
                explanation: 'Tallahassee is the capital of Florida',
                areaToReview: ['geography']
            });

            const response: Response = await fetch(`http://localhost:${PORT}/api/questions/${question?._id}?timestamps=true`, {
                method: 'DELETE'
            });

            const questionResponse: IApiResponse<PopulatedQuestionModelType> = await response.json() as IApiResponse<PopulatedQuestionModelType>;

            expect(response.status).toBe(200);
            expect(questionResponse.data?.createdAt).toBeDefined();
            expect(questionResponse.data?.updatedAt).toBeDefined();
        });
    });
});
