import { Request, Response } from 'express';
import { IApiResponse } from '../types';
import { ITopic } from '../../db/models/Topic';
import type { TopicModelType } from '../../db/models/Topic';
import { topicController } from '../dbControllers/topicController';
import { shouldShowTimestamps, handleRouteErrorMessages, handleRouteErrorCodes } from './routeUtils';


export interface ITopicRouteController {
    getAllTopics: (req: Request, res: Response) => Promise<IApiResponse<ITopic[]>>;
    getTopicById: (req: Request, res: Response) => Promise<IApiResponse<ITopic>>;
    createTopic: (req: Request, res: Response) => Promise<IApiResponse<ITopic>>;
    updateTopicById: (req: Request, res: Response) => Promise<IApiResponse<ITopic>>;
    deleteTopicById: (req: Request, res: Response) => Promise<IApiResponse<ITopic>>;
}

export const topicRouteController: ITopicRouteController = {
    getAllTopics: async (req: Request, res: Response): Promise<IApiResponse<ITopic[]>> => {
        const showTimestamps = shouldShowTimestamps(req);
        try {
            const topics: TopicModelType[] = await topicController.getAllTopics(showTimestamps);
            return res.status(200).json({ data: topics });
        } catch (err: any) {
            const errMsg = handleRouteErrorMessages(err);
            return res.status(handleRouteErrorCodes(errMsg)).json({ error: errMsg });
        }
    },
    getTopicById: async (req: Request, res: Response): Promise<IApiResponse<ITopic>> => {
        const showTimestamps = shouldShowTimestamps(req);
        const { id } = req.params as { id: string };
        try {
            const topic = await topicController.getTopicById(id, showTimestamps);
            return res.status(200).json({ data: topic });
        } catch (err: any) {
            const errMsg = handleRouteErrorMessages(err);
            return res.status(handleRouteErrorCodes(errMsg)).json({ error: errMsg });
        }
    },
    createTopic: async (req: Request, res: Response): Promise<IApiResponse<ITopic>> => {
        const showTimestamps = shouldShowTimestamps(req);
        const { name } = req?.body as { name: string };
        try {
            const topic: TopicModelType = await topicController.createTopic(name);
            // remove the timestamps if they are not requested
            const topicData = showTimestamps ? topic : { _id: topic._id, name: topic.name };
            return res.status(201).json({ data: topicData });
        } catch (err: any) {
            const errMsg = handleRouteErrorMessages(err);
            return res.status(handleRouteErrorCodes(errMsg)).json({ error: errMsg });
        }
    },
    updateTopicById: async (req: Request, res: Response): Promise<IApiResponse<ITopic>> => {
        const showTimestamps = shouldShowTimestamps(req);
        const { id } = req.params as { id: string };
        const { name } = req?.body as { name: string };

        try {
            const topic: TopicModelType | null = await topicController.updateTopicById(id, name, showTimestamps);
            // remove the timestamps if they are    not requested

            if (!topic) return res.status(404).json({ error: 'Topic not found' });

            return res.status(200).json({ data: topic });
        } catch (err: any) {
            const errMsg = handleRouteErrorMessages(err);
            return res.status(handleRouteErrorCodes(errMsg)).json({ error: errMsg });
        }
    },
    deleteTopicById: async (req, res): Promise<IApiResponse<ITopic>> => {
        const { id } = req.params as { id: string };
        try {
            const deleted = await topicController.deleteTopicById(id);
            return res.status(200).json({ data: deleted });
        } catch (err: any) {
            const errMsg = handleRouteErrorMessages(err);
            return res.status(handleRouteErrorCodes(errMsg)).json({ error: errMsg });
        }
    },
}

export default topicRouteController;
