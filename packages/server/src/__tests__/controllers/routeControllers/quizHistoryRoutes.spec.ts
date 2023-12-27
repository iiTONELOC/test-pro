import { afterAll, beforeAll, expect, test, describe } from '@jest/globals';
import { Topic, Question, Quiz, QuizAttempt, QuizQuestionResult, QuizHistory, QuestionTypeEnums } from '../../../db/models';
import { dbConnection, dbClose } from '../../../db/connection';
import { IApiResponse } from '../../../controllers/types';
import { startServer } from '../../../server';
import { Types } from 'mongoose';


import type { IQuestion, IQuiz, ITopic, IQuizAttempt, IQuizQuestionResult, PopulatedQuizHistoryType, IQuizHistory } from '../../../db/types';


const PORT = 3006;

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

const quizHistoryData: IQuizHistory = {
    // @ts-expect-error
    attempt: null
};

let createdQuizHistoryId: Types.ObjectId | null = null;

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
    quizHistoryData.attempt = testQuizAttempt._id;

    // create a quizHistory and add its id to where it's needed
    const testQuizHistory = await QuizHistory.create(quizHistoryData);
    createdQuizHistoryId = testQuizHistory._id;
};

beforeAll(async () => {
    process.env.PORT = PORT.toString();
    await dbConnection(process.env.TEST_DB_NAME)
        .then(async () => {
            await createNeededDbEntries();
            await startServer(undefined, String(PORT));
        });
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


describe('GET /api/history', () => {
    test('should return an array of quiz histories', async () => {
        const response = await fetch(`http://localhost:${PORT}/api/history`);

        const histories = await response.json() as IApiResponse<PopulatedQuizHistoryType[]>;
        expect(response.status).toBe(200);
        expect(Array.isArray(histories.data)).toBeTruthy();
        expect(histories.data).toHaveLength(1);
        // @ts-ignore
        expect(histories?.data[0]?.attempt?._id).toEqual(quizHistoryData.attempt.toString());
    });

    test('It should return unpopulated quiz histories if the no-populate query param is used', async () => {
        const response = await fetch(`http://localhost:${PORT}/api/history?no-populate=true`);

        const histories = await response.json() as IApiResponse<PopulatedQuizHistoryType[]>;
        expect(response.status).toBe(200);
        expect(Array.isArray(histories.data)).toBeTruthy();
        expect(histories.data).toHaveLength(1);
        // @ts-ignore
        expect(histories?.data[0]?.attempt?._id).toBeUndefined();
    });

    test('It should include timestamps if the timestamps query parameter is used', async () => {

        const response = await fetch(`http://localhost:${PORT}/api/history?timestamps=true`);

        const histories = await response.json() as IApiResponse<PopulatedQuizHistoryType[]>;
        expect(response.status).toBe(200);
        expect(Array.isArray(histories.data)).toBeTruthy();
        expect(histories.data).toHaveLength(1);
        // @ts-ignore
        expect(histories?.data[0]?.createdAt).toBeDefined();
        // @ts-ignore
        expect(histories?.data[0]?.updatedAt).toBeDefined();
    });
});

describe('GET /api/history/:id', () => {
    test('It should return a quiz history by id', async () => {
        const response = await fetch(`http://localhost:${PORT}/api/history/${createdQuizHistoryId}`);

        const history = await response.json() as IApiResponse<PopulatedQuizHistoryType>;
        expect(response.status).toBe(200);
        // @ts-ignore
        expect(history?.data?._id).toEqual(createdQuizHistoryId.toString());
        // @ts-ignore
        expect(history?.data?.attempt?._id).toEqual(quizHistoryData.attempt.toString());
    });

    test('It should return null if the id does not exist', async () => {
        const response = await fetch(`http://localhost:${PORT}/api/history/${new Types.ObjectId()}`);

        const history = await response.json() as IApiResponse<PopulatedQuizHistoryType>;
        expect(response.status).toBe(200);
        expect(history.data).toBeNull();
    });

    test('It should return unpopulated quiz history if the no-populate query param is used', async () => {
        const response = await fetch(`http://localhost:${PORT}/api/history/${createdQuizHistoryId}?no-populate=true`);

        const history = await response.json() as IApiResponse<PopulatedQuizHistoryType>;
        expect(response.status).toBe(200);
        // @ts-ignore
        expect(history?.data?._id).toEqual(createdQuizHistoryId.toString());
        // @ts-ignore
        expect(history?.data?.attempt?._id).toBeUndefined();
    });

    test('It should include timestamps if the timestamps query parameter is used', async () => {
        const response = await fetch(`http://localhost:${PORT}/api/history/${createdQuizHistoryId}?timestamps=true`);

        const history = await response.json() as IApiResponse<PopulatedQuizHistoryType>;
        expect(response.status).toBe(200);
        // @ts-ignore
        expect(history?.data?.createdAt).toBeDefined();
        // @ts-ignore
        expect(history?.data?.updatedAt).toBeDefined();
    });
});

describe('POST /api/history', () => {
    test('It should create a quiz history', async () => {
        // create a new quizAttempt and update the quizHistoryData with the new attempt id
        const newQuizAttempt = await QuizAttempt.create(attemptedQuizData);
        quizHistoryData.attempt = newQuizAttempt._id;

        // create a new quizHistory with the updated quizHistoryData
        const response = await fetch(`http://localhost:${PORT}/api/history`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(quizHistoryData)
        });

        const history = await response.json() as IApiResponse<PopulatedQuizHistoryType>;
        expect(response.status).toBe(201);
        // @ts-ignore
        expect(history?.data?._id).toBeDefined();
        // @ts-ignore
        expect(history?.data?.attempt?._id).toEqual(quizHistoryData.attempt.toString());
    });

    test('It should return an error if the quiz history data is invalid', async () => {
        const response = await fetch(`http://localhost:${PORT}/api/history`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...quizHistoryData, attempt: 'invalid id' })
        });

        const history = await response.json() as IApiResponse<PopulatedQuizHistoryType>;
        expect(response.status).toBe(400);
        expect(history.data).toBeUndefined();
        expect(history.error).toBeDefined();
    });

    test('It should return an error if the quiz history data is missing', async () => {
        const response = await fetch(`http://localhost:${PORT}/api/history`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });

        const history = await response.json() as IApiResponse<PopulatedQuizHistoryType>;
        expect(response.status).toBe(400);
        expect(history.data).toBeUndefined();
        expect(history.error).toBeDefined();
    });

    test('It should return unpopulated quiz history if the no-populate query param is used', async () => {
        // create a new quizAttempt and update the quizHistoryData with the new attempt id
        const newQuizAttempt = await QuizAttempt.create(attemptedQuizData);
        quizHistoryData.attempt = newQuizAttempt._id;

        // create a new quizHistory with the updated quizHistoryData
        const response = await fetch(`http://localhost:${PORT}/api/history?no-populate=true`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(quizHistoryData)
        });

        const history = await response.json() as IApiResponse<PopulatedQuizHistoryType>;

        expect(response.status).toBe(201);
        // @ts-ignore
        expect(history?.data?.attempt).toBeDefined();
        // @ts-ignore
        expect(history?.data?.attempt).toEqual(quizHistoryData.attempt.toString());
    });

    test('It should include timestamps if the timestamps query parameter is used', async () => {
        // create a new quizAttempt and update the quizHistoryData with the new attempt id
        const newQuizAttempt = await QuizAttempt.create(attemptedQuizData);
        quizHistoryData.attempt = newQuizAttempt._id;

        // create a new quizHistory with the updated quizHistoryData
        const response = await fetch(`http://localhost:${PORT}/api/history?timestamps=true`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(quizHistoryData)
        });

        const history = await response.json() as IApiResponse<PopulatedQuizHistoryType>;

        expect(response.status).toBe(201);
        // @ts-ignore
        expect(history?.data?.createdAt).toBeDefined();
        // @ts-ignore
        expect(history?.data?.updatedAt).toBeDefined();
    });
});

describe('DELETE /api/history/:id', () => {
    // mock the tests as above
    test('It should delete a quiz history by id', async () => {
        const id = createdQuizHistoryId;
        const response = await fetch(`http://localhost:${PORT}/api/history/${id}`, {
            method: 'DELETE'
        });

        const history = await response.json() as IApiResponse<PopulatedQuizHistoryType>;
        expect(response.status).toBe(200);
        expect(history.data).toBeDefined();
        // @ts-ignore
        expect(history.data?._id).toEqual(id?.toString());
    });

    test('It should return null if the id does not exist', async () => {
        const response = await fetch(`http://localhost:${PORT}/api/history/${new Types.ObjectId()}`, {
            method: 'DELETE'
        });

        const history = await response.json() as IApiResponse<PopulatedQuizHistoryType>;
        expect(response.status).toBe(200);
        expect(history.data).toBeNull();
    });

    test('It should return unpopulated quiz history if the no-populate query param is used', async () => {
        const id = await QuizHistory.find({}).then((history) => history[0]?._id);

        const response = await fetch(`http://localhost:${PORT}/api/history/${id}?no-populate=true`, {
            method: 'DELETE'
        });

        const history = await response.json() as IApiResponse<PopulatedQuizHistoryType>;
        expect(response.status).toBe(200);
        expect(history.data).toBeDefined();
        // @ts-ignore
        expect(history.data?._id).toEqual(id?.toString());
        expect(history.data?.attempt?._id).toBeUndefined();
    });

    test('It should include timestamps if the timestamps query parameter is used', async () => {
        const id = await QuizHistory.find({}).then((history) => history[0]?._id);
        const response = await fetch(`http://localhost:${PORT}/api/history/${id}?timestamps=true`, {
            method: 'DELETE'
        });

        const history = await response.json() as IApiResponse<PopulatedQuizHistoryType>;
        expect(response.status).toBe(200);
        expect(history.data).toBeDefined();
        // @ts-ignore
        expect(history.data?._id).toEqual(id?.toString());
        // @ts-ignore
        expect(history?.data?.createdAt).toBeDefined();
        // @ts-ignore
        expect(history?.data?.updatedAt).toBeDefined();
    });
});

