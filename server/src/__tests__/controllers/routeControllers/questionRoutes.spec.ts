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
    describe('GET /api/questions', async () => {
        test('Get all questions', async () => {
            const response: Response = await fetch(`http://localhost:${PORT}/api/questions`);
            const questions: IApiResponse<PopulatedQuestionModelType[]> = await response.json() as IApiResponse<PopulatedQuestionModelType[]>;

            expect(response.status).toBe(200);
            expect(questions).toEqual({ data: [] });
        });
    });

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
    });

    describe('GET /api/questions/:questionId', async () => {
        test('Get a question by id', async () => {
            // not sure this would run, it would only happen if these tests were run out of order
            if (!question) {
                // create a question
                const newQuestion = await Question.create({
                    questionType: 'MultipleChoice' as QuestionTypeEnums,
                    question: 'What is the capital of Texas?',
                    topics: [new Types.ObjectId()],
                    options: ['Austin', 'Dallas', 'Houston', 'San Antonio'],
                    answer: 'Austin',
                    explanation: 'Austin is the capital of Texas',
                    areaToReview: ['geography']
                });

                const response: Response = await fetch(`http://localhost:${PORT}/api/questions/${newQuestion._id}`);

                const questionResponse: IApiResponse<PopulatedQuestionModelType> = await response.json() as IApiResponse<PopulatedQuestionModelType>;

                expect(response.status).toBe(200);
                expect(questionResponse.data?.question).toBe('What is the capital of Texas?');
                expect(questionResponse.data?.options[0]).toBe('Austin');
                expect(questionResponse.data?.answer).toBe('Austin');
                expect(questionResponse.data?.explanation).toBe('Austin is the capital of Texas');
                expect(questionResponse.data?.areaToReview[0]).toBe('geography');
            } else {
                const response: Response = await fetch(`http://localhost:${PORT}/api/questions/${question._id}`);
                const questionResponse: IApiResponse<PopulatedQuestionModelType> = await response.json() as IApiResponse<PopulatedQuestionModelType>;

                expect(response.status).toBe(200);
                expect(questionResponse.data?.question).toBe('What is the capital of Texas?');
            }
        });

        test('It should return a 404 if no question is found', async () => {
            const response: Response = await fetch(`http://localhost:${PORT}/api/questions/${new Types.ObjectId()}`);
            expect(response.status).toBe(404);
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
    });
});
