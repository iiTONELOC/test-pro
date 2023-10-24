import { Request, Response } from 'express';
import { questionController } from '../dbControllers';
import { shouldShowTimestamps, handleRouteError, httpStatusCodes } from './routeUtils';

import type { IApiResponse } from '../types';
import type { PopulatedQuestionModelType } from '../../db/types';

export interface IQuestionRouteController {
    getAll: (req: Request, res: Response) => Promise<IApiResponse<PopulatedQuestionModelType[]>>;
    getById: (req: Request, res: Response) => Promise<IApiResponse<PopulatedQuestionModelType>>;
    create: (req: Request, res: Response) => Promise<IApiResponse<PopulatedQuestionModelType>>;
    updateById: (req: Request, res: Response) => Promise<IApiResponse<PopulatedQuestionModelType>>;
    deleteById: (req: Request, res: Response) => Promise<IApiResponse<PopulatedQuestionModelType>>;
}

export const questionRouteController: IQuestionRouteController = {
    getAll: async (req: Request, res: Response): Promise<IApiResponse<PopulatedQuestionModelType[]>> => {
        const showTimestamps = shouldShowTimestamps(req);
        try {
            const questions = await questionController.getAll(showTimestamps);
            return res.status(httpStatusCodes.OK).json({ data: questions });
        } catch (error: any) {
            return handleRouteError(res, error.message)
        }
    },
    create: async (req: Request, res: Response): Promise<IApiResponse<PopulatedQuestionModelType>> => {
        try {
            const created = await questionController.create({ ...req.body });
            return res.status(201).json({ data: created });
        } catch (error: any) {
            return handleRouteError(res, error.message)
        }
    },
    getById: async (req: Request, res: Response): Promise<IApiResponse<PopulatedQuestionModelType>> => {
        const showTimestamps = shouldShowTimestamps(req);
        const { id } = req.params as { id: string };
        try {
            const question = await questionController.getById(id, showTimestamps);
            if (!question) throw new Error('Question not found');
            return res.status(httpStatusCodes.OK).json({ data: question });
        } catch (error: any) {
            return handleRouteError(res, error.message)
        }
    },
    updateById: async (req: Request, res: Response): Promise<IApiResponse<PopulatedQuestionModelType>> => {
        const showTimestamps = shouldShowTimestamps(req);
        const { id } = req.params as { id: string };
        try {
            const updated = await questionController.updateById(id, { ...req.body }, showTimestamps);
            if (!updated) throw new Error('Question not found');
            return res.status(httpStatusCodes.OK).json({ data: updated });
        } catch (error: any) {
            return handleRouteError(res, error.message)
        }
    },
    deleteById: async (req: Request, res: Response): Promise<IApiResponse<PopulatedQuestionModelType>> => {
        const { id } = req.params as { id: string };
        try {
            const deleted = await questionController.deleteById(id);
            if (!deleted) throw new Error('Question not found');
            return res.status(httpStatusCodes.OK).json({ data: deleted });
        } catch (error: any) {
            return handleRouteError(res, error.message)
        }
    }
};

export default questionRouteController;
