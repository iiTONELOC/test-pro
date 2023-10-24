import { Request, Response } from 'express';
import { quizController } from '../dbControllers';
import { shouldShowTimestamps, handleRouteError, httpStatusCodes } from './routeUtils';

import type { IApiResponse } from '../types';
import type { PopulatedQuizModel, QuizModelType } from '../../db/types';

export interface IQuizRouteController {
    getAll: (req: Request, res: Response) => Promise<IApiResponse<PopulatedQuizModel[]>>;
    create: (req: Request, res: Response) => Promise<IApiResponse<PopulatedQuizModel>>;
    getById: (req: Request, res: Response) => Promise<IApiResponse<PopulatedQuizModel>>;
    updateById: (req: Request, res: Response) => Promise<IApiResponse<PopulatedQuizModel>>;
    deleteById: (req: Request, res: Response) => Promise<IApiResponse<PopulatedQuizModel>>;
}

export const quizRouteController: IQuizRouteController = {
    getAll: async (req: Request, res: Response): Promise<IApiResponse<PopulatedQuizModel[]>> => {
        const showTimestamps = shouldShowTimestamps(req);
        try {
            const quizzes: PopulatedQuizModel[] = await quizController.getAll(showTimestamps);
            return res.status(httpStatusCodes.OK).json({ data: quizzes });
        } catch (error: any) {
            return handleRouteError(res, error.message);
        }
    },
    create: async (req: Request, res: Response): Promise<IApiResponse<PopulatedQuizModel>> => {
        const showTimestamps = shouldShowTimestamps(req);
        try {
            const quiz: QuizModelType = await quizController.create(req.body, showTimestamps);
            return res.status(httpStatusCodes.CREATED).json({ data: quiz });
        } catch (error: any) {
            return handleRouteError(res, error.message);
        }
    },
    getById: async (req: Request, res: Response): Promise<IApiResponse<PopulatedQuizModel>> => {
        const showTimestamps = shouldShowTimestamps(req);
        try {
            const quiz: PopulatedQuizModel | null = await quizController.getById(req.params.id, showTimestamps);
            if (!quiz) throw new Error('Quiz not found');
            return res.status(httpStatusCodes.OK).json({ data: quiz });
        } catch (error: any) {
            return handleRouteError(res, error.message);
        }
    },
    updateById: async (req: Request, res: Response): Promise<IApiResponse<PopulatedQuizModel>> => {
        const showTimestamps = shouldShowTimestamps(req);
        try {
            const quiz: PopulatedQuizModel | null = await quizController.updateById(req.params.id, req.body, showTimestamps);
            if (!quiz) throw new Error('Quiz not found');
            return res.status(httpStatusCodes.OK).json({ data: quiz });
        } catch (error: any) {
            return handleRouteError(res, error.message);
        }
    },
    deleteById: async (req: Request, res: Response): Promise<IApiResponse<PopulatedQuizModel>> => {
        const showTimestamps = shouldShowTimestamps(req);
        try {
            const quiz: PopulatedQuizModel | null = await quizController.deleteById(req.params.id, showTimestamps);
            if (!quiz) throw new Error('Quiz not found');
            return res.status(httpStatusCodes.OK).json({ data: quiz });
        } catch (error: any) {
            return handleRouteError(res, error.message);
        }
    }
}

export default quizRouteController;
