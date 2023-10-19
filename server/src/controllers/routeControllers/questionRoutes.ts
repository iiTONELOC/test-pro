import { Request, Response } from 'express';
import { questionController } from '../dbControllers';
import { shouldShowTimestamps, handleRouteError, httpStatusCodes } from './routeUtils';

import type { IApiResponse } from '../types';
import type { PopulatedQuestionModelType } from '../../db/types';

export interface IQuestionRouteController {
    getAllQuestions: (req: Request, res: Response) => Promise<IApiResponse<PopulatedQuestionModelType[]>>;
    getQuestionById: (req: Request, res: Response) => Promise<IApiResponse<PopulatedQuestionModelType>>;
    createQuestion: (req: Request, res: Response) => Promise<IApiResponse<PopulatedQuestionModelType>>;
    updateQuestionById: (req: Request, res: Response) => Promise<IApiResponse<PopulatedQuestionModelType>>;
    deleteQuestionById: (req: Request, res: Response) => Promise<IApiResponse<PopulatedQuestionModelType>>;
}

export const questionRouteController: IQuestionRouteController = {
    getAllQuestions: async (req: Request, res: Response): Promise<IApiResponse<PopulatedQuestionModelType[]>> => {
        const showTimestamps = shouldShowTimestamps(req);
        try {
            const questions = await questionController.getAllQuestions(showTimestamps);
            return res.status(httpStatusCodes.OK).json({ data: questions });
        } catch (error: any) {
            return handleRouteError(res, error.message)
        }
    },
    createQuestion: async (req: Request, res: Response): Promise<IApiResponse<PopulatedQuestionModelType>> => {
        try {
            const created = await questionController.createQuestion({ ...req.body });
            return res.status(201).json({ data: created });
        } catch (error: any) {
            return handleRouteError(res, error.message)
        }
    },
    getQuestionById: async (req: Request, res: Response): Promise<IApiResponse<PopulatedQuestionModelType>> => {
        const showTimestamps = shouldShowTimestamps(req);
        const { id } = req.params as { id: string };
        try {
            const question = await questionController.getQuestionById(id, showTimestamps);
            if (!question) throw new Error('Question not found');
            return res.status(httpStatusCodes.OK).json({ data: question });
        } catch (error: any) {
            return handleRouteError(res, error.message)
        }
    },
    updateQuestionById: async (req: Request, res: Response): Promise<IApiResponse<PopulatedQuestionModelType>> => {
        const showTimestamps = shouldShowTimestamps(req);
        const { id } = req.params as { id: string };
        try {
            const updated = await questionController.updateQuestionById(id, { ...req.body }, showTimestamps);
            if (!updated) throw new Error('Question not found');
            return res.status(httpStatusCodes.OK).json({ data: updated });
        } catch (error: any) {
            return handleRouteError(res, error.message)
        }
    },
    deleteQuestionById: async (req: Request, res: Response): Promise<IApiResponse<PopulatedQuestionModelType>> => {
        const { id } = req.params as { id: string };
        try {
            const deleted = await questionController.deleteQuestionById(id);
            if (!deleted) throw new Error('Question not found');
            return res.status(httpStatusCodes.OK).json({ data: deleted });
        } catch (error: any) {
            return handleRouteError(res, error.message)
        }
    }
};

export default questionRouteController;
