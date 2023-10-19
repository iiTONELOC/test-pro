import { Request, Response } from 'express';
import { quizController } from '../dbControllers';
import { shouldShowTimestamps, handleRouteError, httpStatusCodes } from './routeUtils';

import type { IApiResponse } from '../types';
import type { PopulatedQuizModel, QuizModelType } from '../../db/types';

export interface IQuizRouteController {
    getAllQuizzes: (req: Request, res: Response) => Promise<IApiResponse<PopulatedQuizModel[]>>;
    createQuiz: (req: Request, res: Response) => Promise<IApiResponse<PopulatedQuizModel>>;
    getQuizById: (req: Request, res: Response) => Promise<IApiResponse<PopulatedQuizModel>>;
    updateQuizById: (req: Request, res: Response) => Promise<IApiResponse<PopulatedQuizModel>>;
    deleteQuizById: (req: Request, res: Response) => Promise<IApiResponse<PopulatedQuizModel>>;
}

export const quizRouteController: IQuizRouteController = {
    getAllQuizzes: async (req: Request, res: Response): Promise<IApiResponse<PopulatedQuizModel[]>> => {
        const showTimestamps = shouldShowTimestamps(req);
        try {
            const quizzes: PopulatedQuizModel[] = await quizController.getAllQuizzes(showTimestamps);
            return res.status(httpStatusCodes.OK).json({ data: quizzes });
        } catch (error: any) {
            return handleRouteError(res, error.message);
        }
    },
    createQuiz: async (req: Request, res: Response): Promise<IApiResponse<PopulatedQuizModel>> => {
        const showTimestamps = shouldShowTimestamps(req);
        try {
            const quiz: QuizModelType = await quizController.createQuiz(req.body, showTimestamps);
            return res.status(httpStatusCodes.CREATED).json({ data: quiz });
        } catch (error: any) {
            return handleRouteError(res, error.message);
        }
    },
    getQuizById: async (req: Request, res: Response): Promise<IApiResponse<PopulatedQuizModel>> => {
        const showTimestamps = shouldShowTimestamps(req);
        try {
            const quiz: PopulatedQuizModel | null = await quizController.getQuizById(req.params.id, showTimestamps);
            if (!quiz) throw new Error('Quiz not found');
            return res.status(httpStatusCodes.OK).json({ data: quiz });
        } catch (error: any) {
            return handleRouteError(res, error.message);
        }
    },
    updateQuizById: async (req: Request, res: Response): Promise<IApiResponse<PopulatedQuizModel>> => {
        const showTimestamps = shouldShowTimestamps(req);
        try {
            const quiz: PopulatedQuizModel | null = await quizController.updateQuizById(req.params.id, req.body, showTimestamps);
            if (!quiz) throw new Error('Quiz not found');
            return res.status(httpStatusCodes.OK).json({ data: quiz });
        } catch (error: any) {
            return handleRouteError(res, error.message);
        }
    },
    deleteQuizById: async (req: Request, res: Response): Promise<IApiResponse<PopulatedQuizModel>> => {
        const showTimestamps = shouldShowTimestamps(req);
        try {
            const quiz: PopulatedQuizModel | null = await quizController.deleteQuizById(req.params.id, showTimestamps);
            if (!quiz) throw new Error('Quiz not found');
            return res.status(httpStatusCodes.OK).json({ data: quiz });
        } catch (error: any) {
            return handleRouteError(res, error.message);
        }
    }
}

export default quizRouteController;
