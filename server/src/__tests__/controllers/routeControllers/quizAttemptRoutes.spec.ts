import { afterAll, beforeAll, expect, test, describe } from 'bun:test';
import { quizAttemptController, quizQuestionResultController } from '../../../controllers';
import { Question, QuestionTypeEnums, Quiz, QuizAttempt, QuizQuestionResult } from '../../../db/models';
import { dbConnection, dbClose } from '../../../db/connection';
import { startServer } from '../../../server';
import { Types } from 'mongoose';

import type { IApiResponse } from '../../../controllers/types';
import type { PopulatedQuizAttemptType, IQuizQuestionResult, QuizAttemptType } from '../../../db/types';


const PORT = 3004;

beforeAll(async () => {
    process.env.PORT = PORT.toString();
    await dbConnection(process.env.TEST_DB_NAME).then(async () => {
        await startServer();
    });
});

afterAll(async () => {
    await Quiz.deleteMany({});
    await Question.deleteMany({});
    await QuizAttempt.deleteMany({});
    await QuizQuestionResult.deleteMany({});
    await dbClose();
});


describe('Quiz Attempt Routes', () => {
    describe('POST /api/quiz-attempts', () => {
        test('Should create a new quiz attempt', async () => {
            // requires a quiz to exist
            // create a test question for the quiz
            const question = await Question.create({
                questionType: QuestionTypeEnums.MultipleChoice,
                question: 'Test Question',
                topics: [],
                answer: 'Test Answer',
                options: ['Test Answer', 'Test Answer 2', 'Test Answer 3'],
                explanation: 'Test Explanation',
                areaToReview: ['Test Area to Review']
            });

            const quiz = await Quiz.create({
                name: 'Test Quiz',
                topics: [],
                questions: [question._id]
            });

            const response: Response = await fetch(`http://localhost:${PORT}/api/quiz-attempts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    quizId: quiz._id,
                    answeredQuestions: [],
                    earnedPoints: 0,
                    passingPoints: 50,
                    passed: false,
                    dateTaken: new Date(),
                    elapsedTimeInMs: 0
                })
            });

            const quizAttemptResponse: IApiResponse<PopulatedQuizAttemptType> = await response.json() as IApiResponse<PopulatedQuizAttemptType>;

            expect(response.status).toBe(201);
            expect(quizAttemptResponse?.data).toBeDefined();
            expect(quizAttemptResponse?.data?.quizId).toBe(quiz._id.toString());
            expect(quizAttemptResponse?.data?.answeredQuestions).toBeDefined();
            expect(quizAttemptResponse?.data?.earnedPoints).toBe(0);
            expect(quizAttemptResponse?.data?.passingPoints).toBe(50);
            expect(quizAttemptResponse?.data?.passed).toBe(false);
            expect(quizAttemptResponse?.data?.dateTaken).toBeDefined();
            expect(quizAttemptResponse?.data?.elapsedTimeInMs).toBe(0);
        });

        test('It should only create a quiz attempt if the quiz exists', async () => {
            const response: Response = await fetch(`http://localhost:${PORT}/api/quiz-attempts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    quizId: new Types.ObjectId(),
                    answeredQuestions: [],
                    earnedPoints: 0,
                    passingPoints: 50,
                    passed: false,
                    dateTaken: new Date(),
                    elapsedTimeInMs: 0
                })
            });

            const quizAttemptResponse: IApiResponse<PopulatedQuizAttemptType> = await response.json() as IApiResponse<PopulatedQuizAttemptType>;

            expect(response.status).toBe(404);
            expect(quizAttemptResponse?.error).toBeDefined();
            expect(quizAttemptResponse?.error).toBe('Quiz not found.');
        });

        test('It should return unpopulated if the no-populate query param is set to true', async () => {
            // requires a quiz to exist
            // create a test question for the quiz
            const question = await Question.create({
                questionType: QuestionTypeEnums.MultipleChoice,
                question: 'Test Question',
                topics: [],
                answer: 'Test Answer',
                options: ['Test Answer', 'Test Answer 2', 'Test Answer 3'],
                explanation: 'Test Explanation',
                areaToReview: ['Test Area to Review']
            });

            const quiz = await Quiz.create({
                name: 'Test Quiz',
                topics: [],
                questions: [question._id]
            });

            const answeredQuestion = await QuizQuestionResult.create({
                quizAttempt: quiz._id,
                question: question._id,
                selectedAnswer: 'Test Answer',
                isCorrect: true,
                elapsedTimeInMs: 0
            });

            const response: Response = await fetch(`http://localhost:${PORT}/api/quiz-attempts?no-populate=true`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    quizId: quiz._id,
                    answeredQuestions: [answeredQuestion._id],
                    earnedPoints: 0,
                    passingPoints: 50,
                    passed: false,
                    dateTaken: new Date(),
                    elapsedTimeInMs: 0
                })
            });

            const quizAttemptResponse: IApiResponse<QuizAttemptType> = await response.json() as IApiResponse<QuizAttemptType>;

            expect(response.status).toBe(201);
            expect(quizAttemptResponse?.data).toBeDefined();
            expect(quizAttemptResponse?.data?.quizId).toBe(quiz._id.toString());
            expect(quizAttemptResponse?.data?.answeredQuestions[0]).toBe(answeredQuestion._id.toString());
        });

        test('It should return timestamps if the timestamps query param is set to true', async () => {
            // requires a quiz to exist
            // create a test question for the quiz
            const question = await Question.create({
                questionType: QuestionTypeEnums.MultipleChoice,
                question: 'Test Question',
                topics: [],
                answer: 'Test Answer',
                options: ['Test Answer', 'Test Answer 2', 'Test Answer 3'],
                explanation: 'Test Explanation',
                areaToReview: ['Test Area to Review']
            });

            const quiz = await Quiz.create({
                name: 'Test Quiz',
                topics: [],
                questions: [question._id]
            });

            const answeredQuestion = await QuizQuestionResult.create({
                quizAttempt: quiz._id,
                question: question._id,
                selectedAnswer: 'Test Answer',
                isCorrect: true,
                elapsedTimeInMs: 0
            });

            const response: Response = await fetch(`http://localhost:${PORT}/api/quiz-attempts?timestamps=true`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    quizId: quiz._id,
                    answeredQuestions: [answeredQuestion._id],
                    earnedPoints: 0,
                    passingPoints: 50,
                    passed: false,
                    dateTaken: new Date(),
                    elapsedTimeInMs: 0
                })
            });

            const quizAttemptResponse: IApiResponse<PopulatedQuizAttemptType> = await response.json() as IApiResponse<PopulatedQuizAttemptType>;

            expect(response.status).toBe(201);
            expect(quizAttemptResponse?.data).toBeDefined();
            expect(quizAttemptResponse?.data?.quizId).toBe(quiz._id.toString());
            expect(quizAttemptResponse?.data?.createdAt).toBeDefined();
            expect(quizAttemptResponse?.data?.updatedAt).toBeDefined();
        });
    });

    describe('GET /api/quiz-attempts', () => {
        test('Should return an array of quiz attempts', async () => {
            const response: Response = await fetch(`http://localhost:${PORT}/api/quiz-attempts`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            const quizAttemptResponse: IApiResponse<PopulatedQuizAttemptType[]> = await response.json() as IApiResponse<PopulatedQuizAttemptType[]>;

            expect(response.status).toBe(200);
            expect(quizAttemptResponse?.data).toBeDefined();
            expect(Array.isArray(quizAttemptResponse?.data)).toBe(true);
        });

        test('It should return unpopulated if the no-populate query param is set to true', async () => {
            const response: Response = await fetch(`http://localhost:${PORT}/api/quiz-attempts?no-populate=true`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            const quizAttemptResponse: IApiResponse<QuizAttemptType[]> = await response.json() as IApiResponse<QuizAttemptType[]>;

            expect(response.status).toBe(200);
            expect(quizAttemptResponse?.data).toBeDefined();
            expect(Array.isArray(quizAttemptResponse?.data)).toBe(true);
            expect(quizAttemptResponse?.data?.[1].answeredQuestions).toBeDefined();
            expect(quizAttemptResponse?.data?.[1].answeredQuestions?.[0]).toBeDefined();
            // @ts-expect-error
            expect(quizAttemptResponse?.data?.[1].answeredQuestions?.[0]?.question).toBeUndefined();
        });

        test('It should return timestamps if the timestamps query param is set to true', async () => {
            const response: Response = await fetch(`http://localhost:${PORT}/api/quiz-attempts?timestamps=true`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            const quizAttemptResponse: IApiResponse<PopulatedQuizAttemptType[]> = await response.json() as IApiResponse<PopulatedQuizAttemptType[]>;

            expect(response.status).toBe(200);
            expect(quizAttemptResponse?.data).toBeDefined();
            expect(Array.isArray(quizAttemptResponse?.data)).toBe(true);
            expect(quizAttemptResponse?.data?.[1].createdAt).toBeDefined();
            expect(quizAttemptResponse?.data?.[1].updatedAt).toBeDefined();
        });
    });

    describe('GET /api/quiz-attempts/:id', () => {
        test('It should be able to get a quiz attempt by id', async () => {
            const quizAttemptId = await QuizAttempt.find({}).then(quizAttempts => quizAttempts[0]._id);
            const response: Response = await fetch(`http://localhost:${PORT}/api/quiz-attempts/${quizAttemptId}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            const quizAttemptResponse: IApiResponse<PopulatedQuizAttemptType> = await response.json() as IApiResponse<PopulatedQuizAttemptType>;

            expect(response.status).toBe(200);
            expect(quizAttemptResponse?.data).toBeDefined();
        });

        test('It should return a 404 if the quiz attempt does not exist', async () => {
            const response: Response = await fetch(`http://localhost:${PORT}/api/quiz-attempts/${new Types.ObjectId()}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            const quizAttemptResponse: IApiResponse<PopulatedQuizAttemptType> = await response.json() as IApiResponse<PopulatedQuizAttemptType>;

            expect(response.status).toBe(404);
            expect(quizAttemptResponse?.error).toBeDefined();
            expect(quizAttemptResponse?.error).toBe('Quiz attempt not found.');
        });

        test('It should return unpopulated if the no-populate query param is set to true', async () => {
            const quizAttemptId = await QuizAttempt.find({}).then(quizAttempts => quizAttempts[1]._id);
            const response: Response = await fetch(`http://localhost:${PORT}/api/quiz-attempts/${quizAttemptId}?no-populate=true`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            const quizAttemptResponse: IApiResponse<QuizAttemptType> = await response.json() as IApiResponse<QuizAttemptType>;

            expect(response.status).toBe(200);
            expect(quizAttemptResponse?.data).toBeDefined();
            expect(quizAttemptResponse?.data?.answeredQuestions).toBeDefined();
            expect(quizAttemptResponse?.data?.answeredQuestions?.[0]).toBeDefined();
            // @ts-expect-error
            expect(quizAttemptResponse?.data?.answeredQuestions?.[0]?.question).toBeUndefined();
        });

        test('It should return timestamps if the timestamps query param is set to true', async () => {
            const quizAttemptId = await QuizAttempt.find({}).then(quizAttempts => quizAttempts[1]._id);
            const response: Response = await fetch(`http://localhost:${PORT}/api/quiz-attempts/${quizAttemptId}?timestamps=true`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            const quizAttemptResponse: IApiResponse<PopulatedQuizAttemptType> = await response.json() as IApiResponse<PopulatedQuizAttemptType>;

            expect(response.status).toBe(200);
            expect(quizAttemptResponse?.data).toBeDefined();
            expect(quizAttemptResponse?.data?.createdAt).toBeDefined();
            expect(quizAttemptResponse?.data?.updatedAt).toBeDefined();
        });
    });

    describe('PUT /api/quiz-attempts/:id', () => {
        test('It should be able to update a quiz attempt by id', async () => {
            const quizAttemptId = await QuizAttempt.find({}).then(quizAttempts => quizAttempts[0]._id);
            const response: Response = await fetch(`http://localhost:${PORT}/api/quiz-attempts/${quizAttemptId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    quizId: quizAttemptId,
                    answeredQuestions: [],
                    earnedPoints: 0,
                    passingPoints: 50,
                    passed: false,
                    dateTaken: new Date(),
                    elapsedTimeInMs: 0
                })
            });

            const quizAttemptResponse: IApiResponse<PopulatedQuizAttemptType> = await response.json() as IApiResponse<PopulatedQuizAttemptType>;

            expect(response.status).toBe(200);
            expect(quizAttemptResponse?.data).toBeDefined();
        });

        test('It should return a 404 if the quiz attempt does not exist', async () => {
            const response: Response = await fetch(`http://localhost:${PORT}/api/quiz-attempts/${new Types.ObjectId()}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    quizId: new Types.ObjectId(),
                    answeredQuestions: [],
                    earnedPoints: 0,
                    passingPoints: 50,
                    passed: false,
                    dateTaken: new Date(),
                    elapsedTimeInMs: 0
                })
            });

            const quizAttemptResponse: IApiResponse<PopulatedQuizAttemptType> = await response.json() as IApiResponse<PopulatedQuizAttemptType>;

            expect(response.status).toBe(404);
            expect(quizAttemptResponse?.error).toBeDefined();
            expect(quizAttemptResponse?.error).toBe('Quiz attempt not found.');
        });

        test('It should return unpopulated if the no-populate query param is set to true', async () => {
            const quizAttemptId = await QuizAttempt.find({}).then(quizAttempts => quizAttempts[1]._id);
            const response: Response = await fetch(`http://localhost:${PORT}/api/quiz-attempts/${quizAttemptId}?no-populate=true`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    quizId: quizAttemptId,
                    answeredQuestions: [],
                    earnedPoints: 0,
                    passingPoints: 50,
                    passed: false,
                    dateTaken: new Date(),
                    elapsedTimeInMs: 0
                })
            });

            const quizAttemptResponse: IApiResponse<QuizAttemptType> = await response.json() as IApiResponse<QuizAttemptType>;

            expect(response.status).toBe(200);
            expect(quizAttemptResponse?.data).toBeDefined();
            expect(quizAttemptResponse?.data?.answeredQuestions).toBeDefined();
            expect(quizAttemptResponse?.data?.answeredQuestions?.[0]).toBeDefined();
            // @ts-expect-error
            expect(quizAttemptResponse?.data?.answeredQuestions?.[0]?.question).toBeUndefined();
        });

        test('It should return timestamps if the timestamps query param is set to true', async () => {
            const quizAttemptId = await QuizAttempt.find({}).then(quizAttempts => quizAttempts[1]._id);
            const response: Response = await fetch(`http://localhost:${PORT}/api/quiz-attempts/${quizAttemptId}?timestamps=true`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    quizId: quizAttemptId,
                    answeredQuestions: [],
                    earnedPoints: 0,
                    passingPoints: 50,
                    passed: false,
                    dateTaken: new Date(),
                    elapsedTimeInMs: 0
                })
            });

            const quizAttemptResponse: IApiResponse<PopulatedQuizAttemptType> = await response.json() as IApiResponse<PopulatedQuizAttemptType>;

            expect(response.status).toBe(200);
            expect(quizAttemptResponse?.data).toBeDefined();
            expect(quizAttemptResponse?.data?.createdAt).toBeDefined();
            expect(quizAttemptResponse?.data?.updatedAt).toBeDefined();
        });
    });

    describe('GET /api/quiz-attempts/for-quiz/:quizId', () => {
        test('It should be able to get quiz attempts by quiz id', async () => {
            const quizId = await QuizAttempt.find({}).then(attempts => attempts[0].quizId);
            const response: Response = await fetch(`http://localhost:${PORT}/api/quiz-attempts/for-quiz/${quizId.toString()}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            const quizAttemptResponse: IApiResponse<PopulatedQuizAttemptType[]> = await response.json() as IApiResponse<PopulatedQuizAttemptType[]>;

            expect(response.status).toBe(200);
            expect(quizAttemptResponse?.data).toBeDefined();
            expect(Array.isArray(quizAttemptResponse?.data)).toBe(true);
            expect(quizAttemptResponse?.data?.length).toBeGreaterThan(0);
            expect(quizAttemptResponse?.data?.[0].quizId).toBe(quizId.toString());
        });

        test('It should return unpopulated if the no-populate query param is set to true', async () => {
            const quizId = await QuizAttempt.find({}).then(attempts => attempts[1].quizId);

            const response: Response = await fetch(`http://localhost:${PORT}/api/quiz-attempts/for-quiz/${quizId.toString()}?no-populate=true`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            const quizAttemptResponse: IApiResponse<QuizAttemptType[]> = await response.json() as IApiResponse<QuizAttemptType[]>;

            expect(response.status).toBe(200);
            expect(quizAttemptResponse?.data).toBeDefined();
            expect(Array.isArray(quizAttemptResponse?.data)).toBe(true);
            expect(quizAttemptResponse?.data?.length).toBeGreaterThan(0);
            expect(quizAttemptResponse?.data?.[0]?.answeredQuestions[0]).toBeDefined();
            // @ts-expect-error
            expect(quizAttemptResponse?.data?.[0]?.answeredQuestions[0]?.question).toBeUndefined();
        });

        test('It should return timestamps if the timestamps query param is set to true', async () => {
            const quizId = await QuizAttempt.find({}).then(attempts => attempts[1].quizId);

            const response: Response = await fetch(`http://localhost:${PORT}/api/quiz-attempts/for-quiz/${quizId.toString()}?timestamps=true`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            const quizAttemptResponse: IApiResponse<PopulatedQuizAttemptType[]> = await response.json() as IApiResponse<PopulatedQuizAttemptType[]>;

            expect(response.status).toBe(200);
            expect(quizAttemptResponse?.data).toBeDefined();
            expect(Array.isArray(quizAttemptResponse?.data)).toBe(true);
            expect(quizAttemptResponse?.data?.length).toBeGreaterThan(0);
            expect(quizAttemptResponse?.data?.[0]?.createdAt).toBeDefined();
            expect(quizAttemptResponse?.data?.[0]?.updatedAt).toBeDefined();
        });
    });


    describe('POST /api/quiz-attempts/:id/answered-questions', () => {
        test('It should be able to create and add an answered question to an existing quiz attempt', async () => {
            const quizAttemptId = await QuizAttempt.find({}).then(quizAttempts => quizAttempts[0]._id);
            const questionId = await Question.find({}).then(questions => questions[0]._id);
            const answeredQuestionData: Partial<IQuizQuestionResult> = {
                question: questionId,
                selectedAnswer: 'Test Answer',
                elapsedTimeInMs: 0
            };
            const response: Response = await fetch(`http://localhost:${PORT}/api/quiz-attempts/${quizAttemptId}/answered-questions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ answeredQuestion: { ...answeredQuestionData } })
            });

            const quizAttemptResponse: IApiResponse<PopulatedQuizAttemptType> = await response.json() as IApiResponse<PopulatedQuizAttemptType>;
            expect(response.status).toBe(201);
            expect(quizAttemptResponse?.data).toBeDefined();
            expect(quizAttemptResponse?.data?.answeredQuestions).toBeDefined();
            expect(quizAttemptResponse?.data?.answeredQuestions?.length).toBeGreaterThan(0);
            // expect the answered question to have the isCorrect property properly set
            expect(quizAttemptResponse?.data?.answeredQuestions?.[0].isCorrect).toBeDefined();
            expect(quizAttemptResponse?.data?.answeredQuestions?.[0].isCorrect).toBe(true);
        });

        test('It should only create and add an answered question to an existing quiz attempt if the quiz attempt exists', async () => {
            const questionId = await Question.find({}).then(questions => questions[0]._id);
            const answeredQuestionData: Partial<IQuizQuestionResult> = {
                question: questionId,
                selectedAnswer: 'Test Answer',
                elapsedTimeInMs: 0
            };
            const response: Response = await fetch(`http://localhost:${PORT}/api/quiz-attempts/${new Types.ObjectId()}/answered-questions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ answeredQuestion: { ...answeredQuestionData } })
            });

            const quizAttemptResponse: IApiResponse<PopulatedQuizAttemptType> = await response.json() as IApiResponse<PopulatedQuizAttemptType>;
            expect(response.status).toBe(404);
            expect(quizAttemptResponse?.error).toBeDefined();
            expect(quizAttemptResponse?.error).toBe('Quiz attempt not found.');
        });

        test('It Should only create and add an answered question to an existing quiz attempt if the question hasn\'t been answered yet', async () => {
            const quizAttemptId = await QuizAttempt.find({}).then(quizAttempts => quizAttempts[0]._id);
            const questionId = await Question.find({}).then(questions => questions[0]._id);
            const answeredQuestionData: Partial<IQuizQuestionResult> = {
                question: questionId,
                selectedAnswer: 'Test Answer',
                elapsedTimeInMs: 0
            };
            const response: Response = await fetch(`http://localhost:${PORT}/api/quiz-attempts/${quizAttemptId}/answered-questions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ answeredQuestion: { ...answeredQuestionData } })
            });

            const quizAttemptResponse: IApiResponse<PopulatedQuizAttemptType> = await response.json() as IApiResponse<PopulatedQuizAttemptType>;
            expect(response.status).toBe(409);
            expect(quizAttemptResponse?.error).toBeDefined();
            expect(quizAttemptResponse?.error).toBe('Question has already been answered.');
        });

        test('It should return unpopulated if the no-populate query param is set to true', async () => {
            const quizAttemptId = await QuizAttempt.find({}).then(quizAttempts => quizAttempts[1]._id);
            const questionId = await Question.find({}).then(questions => questions[0]._id);
            const answeredQuestionData: Partial<IQuizQuestionResult> = {
                question: questionId,
                selectedAnswer: 'Test Answer',
                elapsedTimeInMs: 0
            };
            const response: Response = await fetch(`http://localhost:${PORT}/api/quiz-attempts/${quizAttemptId}/answered-questions?no-populate=true`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ answeredQuestion: { ...answeredQuestionData } })
            });

            const quizAttemptResponse: IApiResponse<QuizAttemptType> = await response.json() as IApiResponse<QuizAttemptType>;
            expect(response.status).toBe(201);
            expect(quizAttemptResponse?.data).toBeDefined();
            expect(quizAttemptResponse?.data?.answeredQuestions).toBeDefined();
            expect(quizAttemptResponse?.data?.answeredQuestions?.length).toBeGreaterThan(0);
            // @ts-expect-error
            expect(quizAttemptResponse?.data?.answeredQuestions?.[0].question).toBeUndefined();
        });

        test('It should return timestamps if the timestamps query param is set to true', async () => {
            const quizAttemptId = await QuizAttempt.find({}).then(quizAttempts => quizAttempts[1]._id);
            const questionId = await Question.find({}).then(questions => questions[2]._id);
            const answeredQuestionData: Partial<IQuizQuestionResult> = {
                question: questionId,
                selectedAnswer: 'Test Answer',
                elapsedTimeInMs: 0
            };
            const response: Response = await fetch(`http://localhost:${PORT}/api/quiz-attempts/${quizAttemptId}/answered-questions?timestamps=true`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ answeredQuestion: { ...answeredQuestionData } })
            });

            const quizAttemptResponse: IApiResponse<PopulatedQuizAttemptType> = await response.json() as IApiResponse<PopulatedQuizAttemptType>;
            expect(response.status).toBe(201);
            expect(quizAttemptResponse?.data).toBeDefined();
            expect(quizAttemptResponse?.data?.createdAt).toBeDefined();
            expect(quizAttemptResponse?.data?.updatedAt).toBeDefined();
        });
    });

    describe('GET /api/quiz-attempts/:id/grade-quiz', () => {
        test('It should be able to grade a quiz attempt', async () => {

            // create a test question for the quiz
            const question = await Question.create({
                questionType: QuestionTypeEnums.MultipleChoice,
                question: 'Test Question',
                topics: [],
                answer: 'Test Answer',
                options: ['Test Answer', 'Test Answer 2', 'Test Answer 3'],
                explanation: 'Test Explanation',
                areaToReview: ['Test Area to Review']
            });

            // create a test quiz
            const quiz = await Quiz.create({
                name: 'Test Quiz',
                topics: [],
                questions: [question._id]
            });

            // create a test quiz attempt
            const quizAttempt = await QuizAttempt.create({
                quizId: quiz._id,
                answeredQuestions: [],
                earnedPoints: 0,
                passingPoints: 50,
                passed: false,
                dateTaken: new Date(),
                elapsedTimeInMs: 0
            });

            // create a test quiz question result
            const answeredQuestion = await quizQuestionResultController.create({
                quizAttempt: quizAttempt._id,
                question: question._id,
                selectedAnswer: 'Test Answer',
                isCorrect: true,
                elapsedTimeInMs: 0
            });

            // add the quiz question result to the quiz attempt
            await quizAttemptController.updateById(quizAttempt._id.toString(), { answeredQuestions: [answeredQuestion._id] }, {
                showTimestamps: false,
                needToPopulate: false
            });

            const quizAttemptId = quizAttempt._id.toString();
            const response: Response = await fetch(`http://localhost:${PORT}/api/quiz-attempts/${quizAttemptId}/grade-quiz`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            const quizAttemptResponse: IApiResponse<PopulatedQuizAttemptType> = await response.json() as IApiResponse<PopulatedQuizAttemptType>;

            expect(response.status).toBe(200);
            expect(quizAttemptResponse?.data).toBeDefined();
            expect(quizAttemptResponse?.data?.earnedPoints).toBeDefined();
            expect(quizAttemptResponse?.data?.earnedPoints).toBeGreaterThan(0);
            expect(quizAttemptResponse?.data?.passed).toBeDefined();
            expect(quizAttemptResponse?.data?.passed).toBe(true);
        });

        test('It should only grade a quiz attempt if the quiz attempt exists', async () => {
            const quizAttemptId = new Types.ObjectId();
            const response: Response = await fetch(`http://localhost:${PORT}/api/quiz-attempts/${quizAttemptId}/grade-quiz`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            const quizAttemptResponse: IApiResponse<PopulatedQuizAttemptType> = await response.json() as IApiResponse<PopulatedQuizAttemptType>;

            expect(response.status).toBe(404);
            expect(quizAttemptResponse?.error).toBeDefined();
            expect(quizAttemptResponse?.error).toBe('Quiz attempt not found.');
        });

        test('It should only grade a quiz attempt if the quiz attempt has questions answered', async () => {
            // create a test question for the quiz
            const question = await Question.create({
                questionType: QuestionTypeEnums.MultipleChoice,
                question: 'Test Question',
                topics: [],
                answer: 'Test Answer',
                options: ['Test Answer', 'Test Answer 2', 'Test Answer 3'],
                explanation: 'Test Explanation',
                areaToReview: ['Test Area to Review']
            });

            // create a test quiz
            const quiz = await Quiz.create({
                name: 'Test Quiz',
                topics: [],
                questions: [question._id]
            });

            // create a test quiz attempt
            const quizAttempt = await QuizAttempt.create({
                quizId: quiz._id,
                answeredQuestions: [],
                earnedPoints: 0,
                passingPoints: 50,
                passed: false,
                dateTaken: new Date(),
                elapsedTimeInMs: 0
            });

            const quizAttemptId = quizAttempt._id.toString();
            const response: Response = await fetch(`http://localhost:${PORT}/api/quiz-attempts/${quizAttemptId}/grade-quiz`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            const quizAttemptResponse: IApiResponse<PopulatedQuizAttemptType> = await response.json() as IApiResponse<PopulatedQuizAttemptType>;

            expect(response.status).toBe(409);
            expect(quizAttemptResponse?.error).toBeDefined();
            expect(quizAttemptResponse?.error).toBe('Quiz attempt has no answered questions.');
        });

        test('It should return unpopulated if the no-populate query param is set to true', async () => {
            // create a test question for the quiz
            const question = await Question.create({
                questionType: QuestionTypeEnums.MultipleChoice,
                question: 'Test Question',
                topics: [],
                answer: 'Test Answer',
                options: ['Test Answer', 'Test Answer 2', 'Test Answer 3'],
                explanation: 'Test Explanation',
                areaToReview: ['Test Area to Review']
            });

            // create a test quiz and add the question to it
            const quiz = await Quiz.create({
                name: 'Test Quiz',
                topics: [],
                questions: [question._id]
            });

            // create a test quiz attempt
            const quizAttempt = await QuizAttempt.create({
                quizId: quiz._id,
                answeredQuestions: [],
                earnedPoints: 0,
                passingPoints: 50,
                passed: false,
                dateTaken: new Date(),
                elapsedTimeInMs: 0
            });

            // create a test quiz question result
            const answeredQuestion = await quizQuestionResultController.create({
                quizAttempt: quizAttempt._id,
                question: question._id,
                selectedAnswer: 'Test Answer',
                isCorrect: true,
                elapsedTimeInMs: 0
            });

            // add the quiz question result to the quiz attempt
            const updatedQuizAttempt = await quizAttemptController
                .updateById(quizAttempt._id.toString(), { answeredQuestions: [answeredQuestion._id] }, {
                    showTimestamps: false,
                    needToPopulate: false
                });

            const quizAttemptId = updatedQuizAttempt?._id.toString();

            const response: Response = await fetch(`http://localhost:${PORT}/api/quiz-attempts/${quizAttemptId}/grade-quiz?no-populate=true`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            const quizAttemptResponse: IApiResponse<QuizAttemptType> = await response.json() as IApiResponse<QuizAttemptType>;

            expect(response.status).toBe(200);
            expect(quizAttemptResponse?.data).toBeDefined();
            expect(quizAttemptResponse?.data?.earnedPoints).toBeDefined();
            expect(quizAttemptResponse?.data?.answeredQuestions).toBeDefined();
            expect(quizAttemptResponse?.data?.answeredQuestions?.length).toBeGreaterThan(0);
            // @ts-expect-error
            expect(quizAttemptResponse?.data?.answeredQuestions?.[0].question).toBeUndefined();
        });

        test('It should return timestamps if the timestamps query param is set to true', async () => {
            // create a test question for the quiz
            const question = await Question.create({
                questionType: QuestionTypeEnums.MultipleChoice,
                question: 'Test Question',
                topics: [],
                answer: 'Test Answer',
                options: ['Test Answer', 'Test Answer 2', 'Test Answer 3'],
                explanation: 'Test Explanation',
                areaToReview: ['Test Area to Review']
            });

            // create a test quiz and add the question to it
            const quiz = await Quiz.create({
                name: 'Test Quiz',
                topics: [],
                questions: [question._id]
            });

            // create a test quiz attempt
            const quizAttempt = await QuizAttempt.create({
                quizId: quiz._id,
                answeredQuestions: [],
                earnedPoints: 0,
                passingPoints: 50,
                passed: false,
                dateTaken: new Date(),
                elapsedTimeInMs: 0
            });

            // create a test quiz question result
            const answeredQuestion = await quizQuestionResultController.create({
                quizAttempt: quizAttempt._id,
                question: question._id,
                selectedAnswer: 'Test Answer',
                isCorrect: true,
                elapsedTimeInMs: 0
            });

            // add the quiz question result to the quiz attempt
            const updatedQuizAttempt = await quizAttemptController
                .updateById(quizAttempt._id.toString(), { answeredQuestions: [answeredQuestion._id] }, {
                    showTimestamps: false,
                    needToPopulate: false
                });

            const quizAttemptId = updatedQuizAttempt?._id.toString();

            const response: Response = await fetch(`http://localhost:${PORT}/api/quiz-attempts/${quizAttemptId}/grade-quiz?timestamps=true`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            const quizAttemptResponse: IApiResponse<QuizAttemptType> = await response.json() as IApiResponse<QuizAttemptType>;

            expect(response.status).toBe(200);
            expect(quizAttemptResponse?.data).toBeDefined();
            expect(quizAttemptResponse?.data?.createdAt).toBeDefined();
            expect(quizAttemptResponse?.data?.updatedAt).toBeDefined();
        });
    });


    describe('DELETE /api/quiz-attempts/:id', () => {
        test('It should be able to delete a quiz attempt by id', async () => {
            const quizAttemptId = await QuizAttempt.find({}).then(quizAttempts => quizAttempts[0]._id);
            const response: Response = await fetch(`http://localhost:${PORT}/api/quiz-attempts/${quizAttemptId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            });

            const quizAttemptResponse: IApiResponse<PopulatedQuizAttemptType> = await response.json() as IApiResponse<PopulatedQuizAttemptType>;

            expect(response.status).toBe(200);
            expect(quizAttemptResponse?.data).toBeDefined();
        });

        test('It should return a 404 if the quiz attempt does not exist', async () => {
            const response: Response = await fetch(`http://localhost:${PORT}/api/quiz-attempts/${new Types.ObjectId()}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            });

            const quizAttemptResponse: IApiResponse<PopulatedQuizAttemptType> = await response.json() as IApiResponse<PopulatedQuizAttemptType>;

            expect(response.status).toBe(404);
            expect(quizAttemptResponse?.error).toBeDefined();
            expect(quizAttemptResponse?.error).toBe('Quiz attempt not found.');
        });

        test('It should return unpopulated if the no-populate query param is set to true', async () => {
            const quizAttemptId = await QuizAttempt.find({}).then(quizAttempts => quizAttempts[0]._id);
            const response: Response = await fetch(`http://localhost:${PORT}/api/quiz-attempts/${quizAttemptId}?no-populate=true`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            });

            const quizAttemptResponse: IApiResponse<QuizAttemptType> = await response.json() as IApiResponse<QuizAttemptType>;

            expect(response.status).toBe(200);
            expect(quizAttemptResponse?.data).toBeDefined();
            expect(quizAttemptResponse?.data?.answeredQuestions).toBeDefined();
            expect(quizAttemptResponse?.data?.answeredQuestions?.[0]).toBeDefined();
            // @ts-expect-error
            expect(quizAttemptResponse?.data?.answeredQuestions?.[0]?.question).toBeUndefined();
        });

        test('It should return timestamps if the timestamps query param is set to true', async () => {
            const quizAttemptId = await QuizAttempt.find({}).then(quizAttempts => quizAttempts[0]._id);
            const response: Response = await fetch(`http://localhost:${PORT}/api/quiz-attempts/${quizAttemptId}?timestamps=true`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            });

            const quizAttemptResponse: IApiResponse<PopulatedQuizAttemptType> = await response.json() as IApiResponse<PopulatedQuizAttemptType>;

            expect(response.status).toBe(200);
            expect(quizAttemptResponse?.data).toBeDefined();
            expect(quizAttemptResponse?.data?.createdAt).toBeDefined();
            expect(quizAttemptResponse?.data?.updatedAt).toBeDefined();
        });
    });
});
