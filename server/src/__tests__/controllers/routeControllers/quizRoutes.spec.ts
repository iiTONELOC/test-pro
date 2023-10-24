import { afterAll, beforeAll, expect, test, describe } from 'bun:test';
import { Question, Topic, Quiz, QuestionTypeEnums } from '../../../db/models';
import { topicController, questionController } from '../../../controllers';
import { dbConnection, dbClose } from '../../../db/connection';
import { IApiResponse } from '../../../controllers/types';
import { startServer } from '../../../server';
import { Types } from 'mongoose';


import { IQuiz, ITopic, IQuestion, TopicModelType, PopulatedQuestionModelType, PopulatedQuizModel, QuizModelType } from '../../../db/types';

const PORT = 3003;

const testTopicData: ITopic = {
    name: 'quiz testTopicQuizRoute'
};

const testQuestionData: IQuestion = {
    questionType: QuestionTypeEnums.MultipleChoice,
    question: 'testQuestionQuizRoute',
    answer: 'testAnswer',
    // requires the topic ids
    topics: [],
    options: ['testAnswer', 'testOption2', 'testOption3'],
    explanation: 'testExplanation',
    areaToReview: ['testAreaToReview']
};

const testQuizData: IQuiz = {
    name: 'testQuizRoute',
    questions: [],
    // requires the topic ids
    topics: []
};

beforeAll(async () => {
    process.env.PORT = PORT.toString();
    await dbConnection(process.env.TEST_DB_NAME).then(async () => {
        await startServer();
    })

    // create a topic
    const testTopic: TopicModelType = await topicController.create(testTopicData.name);
    const testTopicId: Types.ObjectId = testTopic._id;

    // add the topic id to the testQuestionData
    testQuestionData.topics.push(testTopicId);

    // create a question
    const testQuestion: PopulatedQuestionModelType = await questionController.create(testQuestionData);
    const testQuestionId: Types.ObjectId = testQuestion._id;

    // add the question id to the testQuizData
    testQuizData.questions.push(testQuestionId);
    // add the topic id to the testQuizData
    testQuizData.topics.push(testTopicId);

    // create a quiz
    await Quiz.create(testQuizData);
});

afterAll(async () => {
    await Quiz.deleteMany({});
    await Topic.deleteMany({});
    await Question.deleteMany({});
    await dbClose();
});

describe('Quiz Routes', () => {
    describe('GET /api/quizzes', () => {
        test('Should return an array of quizzes', async () => {
            const response: Response = await fetch(`http://localhost:${PORT}/api/quizzes`);
            const quizzes: IApiResponse<PopulatedQuizModel[]> = await response.json() as IApiResponse<PopulatedQuizModel[]>;

            expect(response.status).toBe(200);
            expect(quizzes?.data?.length).toBe(1);
        });
    });

    describe('GET /api/quizzes/:id', () => {
        test('Should return a quiz', async () => {
            const quiz: QuizModelType | null = await Quiz.findOne({ name: testQuizData.name });
            const response: Response = await fetch(`http://localhost:${PORT}/api/quizzes/${quiz?._id}`);
            const quizResponse: IApiResponse<PopulatedQuizModel> = await response.json() as IApiResponse<PopulatedQuizModel>;

            expect(response.status).toBe(200);
            expect(quizResponse?.data?.name).toBe(testQuizData.name);
            expect(quizResponse?.data?.questions.length).toBe(1);
            expect(quizResponse?.data?.topics.length).toBe(1);
        });

        test('Should return a 404 if quiz is not found', async () => {
            const response: Response = await fetch(`http://localhost:${PORT}/api/quizzes/123456789012`);
            const quizResponse: IApiResponse<PopulatedQuizModel> = await response.json() as IApiResponse<PopulatedQuizModel>;

            expect(response.status).toBe(404);
            expect(quizResponse?.error).toBe('Quiz not found');
        });
    });

    describe('POST /api/quizzes', () => {
        test('Should create a quiz', async () => {
            const response: Response = await fetch(`http://localhost:${PORT}/api/quizzes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(testQuizData)
            });
            const quizResponse: IApiResponse<PopulatedQuizModel> = await response.json() as IApiResponse<PopulatedQuizModel>;

            expect(response.status).toBe(201);
            expect(quizResponse?.data?.name).toBe(testQuizData.name);
            expect(quizResponse?.data?.questions.length).toBe(1);
            expect(quizResponse?.data?.topics.length).toBe(1);
        });

        test('It should return a 400 if data is missing', async () => {
            const response: Response = await fetch(`http://localhost:${PORT}/api/quizzes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({})
            });
            const quizResponse: IApiResponse<PopulatedQuizModel> = await response.json() as IApiResponse<PopulatedQuizModel>;

            expect(response.status).toBe(400);
            expect(quizResponse?.error).toBe('Quiz validation failed: name: Path `name` is required.');
        });
    });

    describe('PUT /api/quizzes/:id', () => {
        test('Should update a quiz', async () => {
            const quiz: QuizModelType | null = await Quiz.findOne({ name: testQuizData.name });
            const response: Response = await fetch(`http://localhost:${PORT}/api/quizzes/${quiz?._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: 'updatedQuiz' })
            });
            const quizResponse: IApiResponse<PopulatedQuizModel> = await response.json() as IApiResponse<PopulatedQuizModel>;

            expect(response.status).toBe(200);
            expect(quizResponse?.data?.name).toBe('updatedQuiz');
            expect(quizResponse?.data?.questions.length).toBe(1);
            expect(quizResponse?.data?.topics.length).toBe(1);
        });

        test('Should return a 404 if quiz is not found', async () => {
            const response: Response = await fetch(`http://localhost:${PORT}/api/quizzes/123456789012`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: 'updatedQuiz' })
            });
            const quizResponse: IApiResponse<PopulatedQuizModel> = await response.json() as IApiResponse<PopulatedQuizModel>;

            expect(response.status).toBe(404);
            expect(quizResponse?.error).toBe('Quiz not found');
        });

        test('Should return a 400 if data is missing', async () => {
            const quiz: QuizModelType | null = await Quiz.findOne({ name: testQuizData.name });
            const response: Response = await fetch(`http://localhost:${PORT}/api/quizzes/${quiz?._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({})
            });
            const quizResponse: IApiResponse<PopulatedQuizModel> = await response.json() as IApiResponse<PopulatedQuizModel>;

            expect(response.status).toBe(400);
            expect(quizResponse?.error).toBe('Nothing to update');
        });
    });

    describe('DELETE /api/quizzes/:id', () => {
        test('Should delete a quiz', async () => {
            const quiz: QuizModelType | null = await Quiz.findOne({ name: testQuizData.name });
            const response: Response = await fetch(`http://localhost:${PORT}/api/quizzes/${quiz?._id}`, {
                method: 'DELETE'
            });
            const quizResponse: IApiResponse<PopulatedQuizModel> = await response.json() as IApiResponse<PopulatedQuizModel>;

            expect(response.status).toBe(200);
            expect(quizResponse?.data?.name).toBe('testQuizRoute');
            expect(quizResponse?.data?.questions.length).toBe(1);
            expect(quizResponse?.data?.topics.length).toBe(1);
        });

        test('Should return a 404 if quiz is not found', async () => {
            const response: Response = await fetch(`http://localhost:${PORT}/api/quizzes/123456789012`, {
                method: 'DELETE'
            });
            const quizResponse: IApiResponse<PopulatedQuizModel> = await response.json() as IApiResponse<PopulatedQuizModel>;

            expect(response.status).toBe(404);
            expect(quizResponse?.error).toBe('Quiz not found');
        });
    });
});



