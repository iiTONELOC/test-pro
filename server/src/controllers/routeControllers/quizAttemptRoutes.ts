import { Request, Response } from 'express';
import { shouldShowTimestamps, handleRouteError, httpStatusCodes } from './routeUtils';
import { quizAttemptController, quizQuestionResultController, quizController, questionController } from '../dbControllers';

import type { IApiResponse } from '../types';
import type { PopulatedQuizAttemptType, IQuizQuestionResult, QuizQuestionResultType } from '../../db/types';

export interface IQuizAttemptRouteController {
    getAll(req: Request, res: Response): Promise<IApiResponse<PopulatedQuizAttemptType[]>>;
    create(req: Request, res: Response): Promise<IApiResponse<PopulatedQuizAttemptType>>;
    getById(req: Request, res: Response): Promise<IApiResponse<PopulatedQuizAttemptType>>;
    updateById(req: Request, res: Response): Promise<IApiResponse<PopulatedQuizAttemptType>>;
    deleteById(req: Request, res: Response): Promise<IApiResponse<PopulatedQuizAttemptType>>;
    getByQuizId(req: Request, res: Response): Promise<IApiResponse<PopulatedQuizAttemptType[]>>;
    addAnsweredQuestion(req: Request, res: Response): Promise<IApiResponse<PopulatedQuizAttemptType>>;
    gradeQuizAttempt(req: Request, res: Response): Promise<IApiResponse<PopulatedQuizAttemptType>>;
}

export const quizAttemptRouteController: IQuizAttemptRouteController = {
    getAll: async (req: Request, res: Response): Promise<IApiResponse<PopulatedQuizAttemptType[]>> => {
        const showTimeStamps = shouldShowTimestamps(req);

        try {
            const quizAttempts = await quizAttemptController.getAll(showTimeStamps);
            return res.status(httpStatusCodes.OK).json({ data: quizAttempts });
        } catch (error: any) {
            return handleRouteError(res, error.message);
        }
    },
    create: async (req: Request, res: Response): Promise<IApiResponse<PopulatedQuizAttemptType>> => {
        const showTimeStamps = shouldShowTimestamps(req);
        try {
            // lookup the quiz by id, if it doesn't exist, throw an error
            const existingQuiz = await quizController.getById(req.body.quizId, showTimeStamps);
            if (!existingQuiz) throw new Error('Quiz not found.');
            const quizAttempt = await quizAttemptController.create(req.body, showTimeStamps);
            return res.status(httpStatusCodes.CREATED).json({ data: quizAttempt });
        } catch (error: any) {
            return handleRouteError(res, error.message);
        }
    },
    getById: async (req: Request, res: Response): Promise<IApiResponse<PopulatedQuizAttemptType>> => {
        const showTimeStamps = shouldShowTimestamps(req);
        try {
            const quizAttempt = await quizAttemptController.getById(req.params.id, showTimeStamps);
            if (!quizAttempt) throw new Error('Quiz attempt not found.');
            return res.status(httpStatusCodes.OK).json({ data: quizAttempt });
        } catch (error: any) {
            return handleRouteError(res, error.message);
        }
    },
    updateById: async (req: Request, res: Response): Promise<IApiResponse<PopulatedQuizAttemptType>> => {
        const showTimeStamps = shouldShowTimestamps(req);
        try {
            const quizAttempt = await quizAttemptController.updateById(req.params.id, req.body, showTimeStamps);
            if (!quizAttempt) throw new Error('Quiz attempt not found.');
            return res.status(httpStatusCodes.OK).json({ data: quizAttempt });
        } catch (error: any) {
            return handleRouteError(res, error.message);
        }
    },
    deleteById: async (req: Request, res: Response): Promise<IApiResponse<PopulatedQuizAttemptType>> => {
        const showTimeStamps = shouldShowTimestamps(req);
        try {
            const quizAttempt = await quizAttemptController.deleteById(req.params.id, showTimeStamps);
            if (!quizAttempt) throw new Error('Quiz attempt not found.');
            return res.status(httpStatusCodes.OK).json({ data: quizAttempt });
        } catch (error: any) {
            return handleRouteError(res, error.message);
        }
    },
    getByQuizId: async (req: Request, res: Response): Promise<IApiResponse<PopulatedQuizAttemptType[]>> => {
        const showTimeStamps = shouldShowTimestamps(req);
        const { quizId } = req.params;
        try {
            const quizAttempts = await quizAttemptController.getByQuizId(quizId, showTimeStamps);
            return res.status(httpStatusCodes.OK).json({ data: quizAttempts });
        } catch (error: any) {
            return handleRouteError(res, error.message);
        }
    },
    addAnsweredQuestion: async (req: Request, res: Response): Promise<IApiResponse<PopulatedQuizAttemptType>> => {
        // quizAttemptId
        const { id } = req.params;
        // extract the answeredQuestion from the request body
        const { answeredQuestion } = req.body;
        const showTimeStamps = shouldShowTimestamps(req);

        try {
            // we need to make sure the quizAttempt exists
            const quizAttempt: PopulatedQuizAttemptType | null = await quizAttemptController.getById(id, showTimeStamps);
            if (!quizAttempt) throw new Error('Quiz attempt not found.');

            // we need to make sure the question hasn't already been answered
            const questionId = answeredQuestion?.question ?? null
            for (const question of quizAttempt.answeredQuestions) {
                if (questionId === question.question._id.toString()) throw new Error('Question has already been answered.');
            }

            // need to grade the question, first we need to get the original question so we can compare the answers
            const originalQuestion = await questionController.getById(questionId, false);
            if (!originalQuestion) throw new Error('Question not found.');

            const correctAnswer = originalQuestion.answer;
            const isCorrect = correctAnswer === answeredQuestion.selectedAnswer;

            // create the question result using the quizAttemptId from the request params
            const questionResult = await quizQuestionResultController.create({
                ...answeredQuestion,
                quizAttempt: id,
                isCorrect
            } as IQuizQuestionResult, showTimeStamps);

            // if this returns null, throw an error
            if (!questionResult) throw new Error('Could not create question result.');

            // add the question result to the quizAttempt
            const updatedQuizAttempt = await quizAttemptController
                .updateById(id, { answeredQuestions: [questionResult._id] }, showTimeStamps);

            // if this returns null, throw an error
            if (!updatedQuizAttempt) throw new Error('There was an adding the answered question.');

            return res.status(httpStatusCodes.CREATED).json({ data: updatedQuizAttempt });
        } catch (error: any) {
            return handleRouteError(res, error.message);
        }
    },
    // TODO: this should return a QuizHistory
    gradeQuizAttempt: async (req: Request, res: Response): Promise<IApiResponse<PopulatedQuizAttemptType>> => {
        const { id } = req.params;
        const showTimeStamps = shouldShowTimestamps(req);

        try {
            // get the quizAttempt
            const ungradedAttempt = await quizAttemptController.getById(id, showTimeStamps);
            if (!ungradedAttempt) throw new Error('Quiz attempt not found.');

            // get the quiz
            const originalQuizData = await quizController.getById(ungradedAttempt.quizId.toString(), showTimeStamps);
            if (!originalQuizData) throw new Error('Quiz not found.');

            // get the number of questions
            const totalNumberOfQuestions = originalQuizData.questions.length;

            // find the number of correct answers
            const numberOfCorrectAnswers = ungradedAttempt.answeredQuestions
                .filter((answer: QuizQuestionResultType) => answer.isCorrect).length;

            // calculate the percentage
            const percentage = numberOfCorrectAnswers / totalNumberOfQuestions * 100;
            const passed = percentage >= 70;

            // update the quizAttempt and set the correct data for earnedPoints, passingPoints, and passed
            const gradedAttempt = await quizAttemptController.updateById(id, {
                earnedPoints: numberOfCorrectAnswers,
                passingPoints: totalNumberOfQuestions,
                passed
            }, showTimeStamps);

            if (!gradedAttempt) throw new Error('There was an error grading the quiz attempt.');
            return res.status(httpStatusCodes.OK).json({ data: gradedAttempt });
        } catch (error: any) {
            return handleRouteError(res, error.message);
        }
    }
}

export default quizAttemptRouteController;
