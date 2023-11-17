import { Request, Response } from 'express';
import { quizHistoryController } from '../dbControllers'
import { handleRouteError, httpStatusCodes, extractDbQueryParams } from './routeUtils';

import type { IApiResponse } from '../types';
import type { QuizHistoryModelResponse } from '../dbControllers/quizHistoryController';


export interface IQuizHistoryRouteController {
    getAll(req: Request, res: Response): Promise<IApiResponse<QuizHistoryModelResponse[]>>;
    create(req: Request, res: Response): Promise<IApiResponse<QuizHistoryModelResponse>>;
    getById(req: Request, res: Response): Promise<IApiResponse<QuizHistoryModelResponse>>;
    deleteById(req: Request, res: Response): Promise<IApiResponse<QuizHistoryModelResponse>>;
}

export const quizHistoryRouteController: IQuizHistoryRouteController = {
    getAll: async (req, res): Promise<IApiResponse<QuizHistoryModelResponse[]>> => {
        try {
            const quizHistories = await quizHistoryController.getAll(extractDbQueryParams(req));
            return res.status(httpStatusCodes.OK).json({ data: quizHistories });
        } catch (error: any) {
            return handleRouteError(res, error.message);
        }
    },
    create: async (req, res): Promise<IApiResponse<QuizHistoryModelResponse>> => {
        try {
            const quizHistory = await quizHistoryController.create(req.body, extractDbQueryParams(req));
            return res.status(httpStatusCodes.CREATED).json({ data: quizHistory });
        } catch (error: any) {
            return handleRouteError(res, error.message);
        }
    },
    getById: async (req, res): Promise<IApiResponse<QuizHistoryModelResponse>> => {
        const { id } = req.params;
        try {
            const quizHistory = await quizHistoryController.getById(id, extractDbQueryParams(req));
            return res.status(httpStatusCodes.OK).json({ data: quizHistory });
        } catch (error: any) {
            return handleRouteError(res, error.message);
        }
    },
    deleteById: async (req, res): Promise<IApiResponse<QuizHistoryModelResponse>> => {
        const { id } = req.params;
        try {
            const quizHistory = await quizHistoryController.deleteById(id, extractDbQueryParams(req));
            return res.status(httpStatusCodes.OK).json({ data: quizHistory });
        } catch (error: any) {
            return handleRouteError(res, error.message);
        }
    }
};

export default quizHistoryRouteController;
