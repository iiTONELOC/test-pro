import { Request, Response } from 'express';
import { questionController } from '../dbControllers';
import { handleRouteError, httpStatusCodes, extractDbQueryParams } from './routeUtils';

import type { IApiResponse } from '../types';
import { QuestionModelResponse } from '../dbControllers/questionController';

export interface IQuestionRouteController {
    getAll: (req: Request, res: Response) => Promise<IApiResponse<QuestionModelResponse[]>>;
    getById: (req: Request, res: Response) => Promise<IApiResponse<QuestionModelResponse>>;
    create: (req: Request, res: Response) => Promise<IApiResponse<QuestionModelResponse>>;
    updateById: (req: Request, res: Response) => Promise<IApiResponse<QuestionModelResponse>>;
    deleteById: (req: Request, res: Response) => Promise<IApiResponse<QuestionModelResponse>>;
}

export const questionRouteController: IQuestionRouteController = {
    getAll: async (req: Request, res: Response): Promise<IApiResponse<QuestionModelResponse[]>> => {
        try {
            const questions = await questionController.getAll(extractDbQueryParams(req));
            return res.status(httpStatusCodes.OK).json({ data: questions });
        } catch (error: any) {
            return handleRouteError(res, error.message)
        }
    },
    create: async (req: Request, res: Response): Promise<IApiResponse<QuestionModelResponse>> => {
        try {
            const created = await questionController.create({ ...req.body }, extractDbQueryParams(req));
            return res.status(201).json({ data: created });
        } catch (error: any) {
            return handleRouteError(res, error.message)
        }
    },
    getById: async (req: Request, res: Response): Promise<IApiResponse<QuestionModelResponse>> => {
        const { id } = req.params as { id: string };
        try {
            const question = await questionController.getById(id, extractDbQueryParams(req));
            if (!question) throw new Error('Question not found');
            return res.status(httpStatusCodes.OK).json({ data: question });
        } catch (error: any) {
            return handleRouteError(res, error.message)
        }
    },
    updateById: async (req: Request, res: Response): Promise<IApiResponse<QuestionModelResponse>> => {
        const { id } = req.params as { id: string };
        try {
            const updated = await questionController.updateById(id, { ...req.body }, extractDbQueryParams(req));
            if (!updated) throw new Error('Question not found');
            return res.status(httpStatusCodes.OK).json({ data: updated });
        } catch (error: any) {
            return handleRouteError(res, error.message)
        }
    },
    deleteById: async (req: Request, res: Response): Promise<IApiResponse<QuestionModelResponse>> => {
        const { id } = req.params as { id: string };
        try {
            const deleted = await questionController.deleteById(id, extractDbQueryParams(req));
            if (!deleted) throw new Error('Question not found');
            return res.status(httpStatusCodes.OK).json({ data: deleted });
        } catch (error: any) {
            return handleRouteError(res, error.message)
        }
    }
};

export default questionRouteController;
