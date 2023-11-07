import { Request, Response } from 'express';
import { quizController } from '../dbControllers';
import { handleRouteError, httpStatusCodes, extractDbQueryParams } from './routeUtils';

import type { IApiResponse, QuizModelResponse } from '../types';

export interface IQuizRouteController {
    getAll: (req: Request, res: Response) => Promise<IApiResponse<(QuizModelResponse)[]>>;
    create: (req: Request, res: Response) => Promise<IApiResponse<(QuizModelResponse)>>;
    getById: (req: Request, res: Response) => Promise<IApiResponse<(QuizModelResponse)>>;
    updateById: (req: Request, res: Response) => Promise<IApiResponse<(QuizModelResponse)>>;
    deleteById: (req: Request, res: Response) => Promise<IApiResponse<(QuizModelResponse)>>;
}

export const quizRouteController: IQuizRouteController = {
    getAll: async (req: Request, res: Response): Promise<IApiResponse<(QuizModelResponse)[]>> => {
        try {
            const quizzes: QuizModelResponse[] = await quizController.getAll(extractDbQueryParams(req));
            return res.status(httpStatusCodes.OK).json({ data: quizzes });
        } catch (error: any) {
            return handleRouteError(res, error.message);
        }
    },
    create: async (req: Request, res: Response): Promise<IApiResponse<(QuizModelResponse)>> => {
        try {
            const quiz: QuizModelResponse | null = await quizController.create(req.body, extractDbQueryParams(req));
            return res.status(httpStatusCodes.CREATED).json({ data: quiz });
        } catch (error: any) {
            return handleRouteError(res, error.message);
        }
    },
    getById: async (req: Request, res: Response): Promise<IApiResponse<(QuizModelResponse)>> => {
        try {
            const quiz: QuizModelResponse | null = await quizController.getById(req.params.id, extractDbQueryParams(req));
            if (!quiz) throw new Error('Quiz not found');
            return res.status(httpStatusCodes.OK).json({ data: quiz });
        } catch (error: any) {
            return handleRouteError(res, error.message);
        }
    },
    updateById: async (req: Request, res: Response): Promise<IApiResponse<(QuizModelResponse)>> => {
        try {
            const quiz: QuizModelResponse | null = await quizController.updateById(req.params.id, req.body, extractDbQueryParams(req));
            if (!quiz) throw new Error('Quiz not found');
            return res.status(httpStatusCodes.OK).json({ data: quiz });
        } catch (error: any) {
            return handleRouteError(res, error.message);
        }
    },
    deleteById: async (req: Request, res: Response): Promise<IApiResponse<(QuizModelResponse)>> => {
        try {
            const quiz: (QuizModelResponse) | null = await quizController.deleteById(req.params.id, extractDbQueryParams(req));
            if (!quiz) throw new Error('Quiz not found');
            return res.status(httpStatusCodes.OK).json({ data: quiz });
        } catch (error: any) {
            return handleRouteError(res, error.message);
        }
    }
}

export default quizRouteController;
