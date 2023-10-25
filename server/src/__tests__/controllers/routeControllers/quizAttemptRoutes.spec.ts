import { afterAll, beforeAll, expect, test, describe } from 'bun:test';
import { questionController, quizAttemptController, quizController, quizQuestionResultController } from '../../../controllers';
import { Question, QuestionTypeEnums, Quiz, QuizAttempt, QuizQuestionResult } from '../../../db/models';
import { dbConnection, dbClose } from '../../../db/connection';
import { startServer } from '../../../server';
import { Types } from 'mongoose';

import type { IApiResponse } from '../../../controllers/types';
import type { PopulatedQuizAttemptType, IQuizQuestionResult } from '../../../db/types';

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
            const question = await questionController.create({
                questionType: QuestionTypeEnums.MultipleChoice,
                question: 'Test Question',
                topics: [],
                answer: 'Test Answer',
                options: ['Test Answer', 'Test Answer 2', 'Test Answer 3'],
                explanation: 'Test Explanation',
                areaToReview: ['Test Area to Review']
            });

            const quiz = await quizController.create({
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
    });

    describe('GET /api/quiz-attempts/:id', () => {
        test('It should be able to get a quiz attempt by id', async () => {
            const quizAttemptId = await quizAttemptController.getAll().then(quizAttempts => quizAttempts[0]._id);
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
    });

    describe('PUT /api/quiz-attempts/:id', () => {
        test('It should be able to update a quiz attempt by id', async () => {
            const quizAttemptId = await quizAttemptController.getAll().then(quizAttempts => quizAttempts[0]._id);
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
    });

    describe('GET /api/quiz-attempts/for-quiz/:quizId', () => {
        test('It should be able to get quiz attempts by quiz id', async () => {
            const quizId = await quizAttemptController.getAll().then(attempts => attempts[0].quizId);

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
    });


    describe('POST /api/quiz-attempts/:id/answered-questions', () => {
        test('It should be able to create and add an answered question to an existing quiz attempt', async () => {
            const quizAttemptId = await quizAttemptController.getAll().then(quizAttempts => quizAttempts[0]._id);
            const questionId = await questionController.getAll().then(questions => questions[0]._id);
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
            const questionId = await questionController.getAll().then(questions => questions[0]._id);
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
            const quizAttemptId = await quizAttemptController.getAll().then(quizAttempts => quizAttempts[0]._id);
            const questionId = await questionController.getAll().then(questions => questions[0]._id);
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
    });

    describe('GET /api/quiz-attempts/:id/grade-quiz', () => {
        test('It should be able to grade a quiz attempt', async () => {

            // create a test question for the quiz
            const question = await questionController.create({
                questionType: QuestionTypeEnums.MultipleChoice,
                question: 'Test Question',
                topics: [],
                answer: 'Test Answer',
                options: ['Test Answer', 'Test Answer 2', 'Test Answer 3'],
                explanation: 'Test Explanation',
                areaToReview: ['Test Area to Review']
            });

            // create a test quiz
            const quiz = await quizController.create({
                name: 'Test Quiz',
                topics: [],
                questions: [question._id]
            });

            // create a test quiz attempt
            const quizAttempt = await quizAttemptController.create({
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
            await quizAttemptController.updateById(quizAttempt._id.toString(), { answeredQuestions: [answeredQuestion._id] });

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
    });


    describe('DELETE /api/quiz-attempts/:id', () => {
        test('It should be able to delete a quiz attempt by id', async () => {
            const quizAttemptId = await quizAttemptController.getAll().then(quizAttempts => quizAttempts[0]._id);
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
    });
});
