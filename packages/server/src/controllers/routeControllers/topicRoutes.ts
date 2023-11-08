import { Request, Response } from 'express';
import { IApiResponse } from '../types';
import { ITopic } from '../../db/models/Topic';
import type { TopicModelType } from '../../db/models/Topic';
import { topicController } from '../dbControllers/topicController';
import { shouldShowTimestamps, handleRouteError, httpStatusCodes } from './routeUtils';


export interface ITopicRouteController {
    getAll: (req: Request, res: Response) => Promise<IApiResponse<ITopic[]>>;
    getById: (req: Request, res: Response) => Promise<IApiResponse<ITopic>>;
    create: (req: Request, res: Response) => Promise<IApiResponse<ITopic>>;
    updateById: (req: Request, res: Response) => Promise<IApiResponse<ITopic>>;
    deleteById: (req: Request, res: Response) => Promise<IApiResponse<ITopic>>;
}

export const topicRouteController: ITopicRouteController = {
    getAll: async (req: Request, res: Response): Promise<IApiResponse<ITopic[]>> => {
        const showTimestamps = shouldShowTimestamps(req);
        try {
            const topics: TopicModelType[] = await topicController.getAll(showTimestamps);
            return res.status(httpStatusCodes.OK).json({ data: topics });
        } catch (err: any) {
            return handleRouteError(res, err.message)
        }
    },
    getById: async (req: Request, res: Response): Promise<IApiResponse<ITopic>> => {
        const showTimestamps = shouldShowTimestamps(req);
        const { id } = req.params as { id: string };
        try {
            const topic = await topicController.getById(id, showTimestamps);
            if (!topic) throw new Error('Topic not found');
            return res.status(httpStatusCodes.OK).json({ data: topic });
        } catch (err: any) {
            return handleRouteError(res, err.message)
        }
    },
    create: async (req: Request, res: Response): Promise<IApiResponse<ITopic>> => {
        const showTimestamps = shouldShowTimestamps(req);
        const { name } = req?.body as { name: string };
        try {
            const topic: TopicModelType = await topicController.create(name);
            // remove the timestamps if they are not requested
            const topicData = showTimestamps ? topic : { _id: topic._id, name: topic.name };
            return res.status(201).json({ data: topicData });
        } catch (err: any) {
            return handleRouteError(res, err.message)
        }
    },
    updateById: async (req: Request, res: Response): Promise<IApiResponse<ITopic>> => {
        const showTimestamps = shouldShowTimestamps(req);
        const { id } = req.params as { id: string };
        const { name } = req?.body as { name: string };

        try {
            const topic: TopicModelType | null = await topicController.updateById(id, name, showTimestamps);
            if (!topic) throw new Error('Topic not found');
            return res.status(httpStatusCodes.OK).json({ data: topic });
        } catch (err: any) {
            return handleRouteError(res, err.message)
        }
    },
    deleteById: async (req, res): Promise<IApiResponse<ITopic>> => {
        const { id } = req.params as { id: string };
        try {
            const deleted = await topicController.deleteById(id);
            if (!deleted) throw new Error('Topic not found');
            return res.status(httpStatusCodes.OK).json({ data: deleted });
        } catch (err: any) {
            return handleRouteError(res, err.message)
        }
    }
}

export default topicRouteController;
