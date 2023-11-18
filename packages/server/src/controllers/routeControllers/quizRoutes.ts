import { Request, Response } from 'express';
import { quizController, questionController } from '../dbControllers';
import { handleRouteError, httpStatusCodes, extractDbQueryParams } from './routeUtils';

import type { IApiResponse, QuizModelResponse, dbQueryParams } from '../types';
import { QuestionTypeEnums, TopicModelType } from '../../db/types';
import { Topic, Quiz, Question } from '../../db/models';
import { Types } from 'mongoose';

/**
 * ```ts
 * interface IQuizQuestionJsonData {
 *    type: QuestionTypeEnums
 *    question: string;
 *    topics: string[];
 *    answer: string
 *    options: string[];
 *    explanation: string;
 *    areaToReview: string;
 *  }
 * ```
 */
export interface IQuizQuestionJsonData {
    type: QuestionTypeEnums;
    question: string;
    topics: string[];
    answer: string
    options: string[];
    explanation: string;
    areaToReview: string[];
}

/**
 * ```ts
 * interface IQuizByJsonData {
 *   name: string;
 *   topics: string[];
 *   questions:[{
 *      type: QuestionTypeEnums;
 *      question: string;
 *      topics: string[];
 *      answer: string
 *      options: string[];
 *      explanation: string;
 *      areaToReview: string;
 *   }];
 *  }
 * ```
 */
export interface IQuizByJsonData {
    name: string;
    topics: string[];
    questions: IQuizQuestionJsonData[];
}

export interface IQuizRouteController {
    getAll: (req: Request, res: Response) => Promise<IApiResponse<(QuizModelResponse)[]>>;
    create: (req: Request, res: Response) => Promise<IApiResponse<(QuizModelResponse)>>;
    getById: (req: Request, res: Response) => Promise<IApiResponse<(QuizModelResponse)>>;
    updateById: (req: Request, res: Response) => Promise<IApiResponse<(QuizModelResponse)>>;
    deleteById: (req: Request, res: Response) => Promise<IApiResponse<(QuizModelResponse)>>;
    createQuizByJSON: (req: Request, res: Response) => Promise<IApiResponse<(QuizModelResponse)>>;
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
    },
    createQuizByJSON: async (req: Request, res: Response): Promise<IApiResponse<(QuizModelResponse)>> => {
        const getOrCreateTopic = async (topicName: string): Promise<string> => {
            let topic = await Topic.findOne({ name: topicName });
            if (!topic) {
                topic = await Topic.create({ name: topicName });
            }
            return topic._id.toString();
        };

        const getOrCreateQuestion = async (questionData: IQuizQuestionJsonData): Promise<string | null> => {

            let question = await Question.findOne({ question: questionData.question });

            if (!question) {
                const questionTopicIds = await Promise.all(questionData.topics.map(getOrCreateTopic));
                question = await questionController.create({
                    questionType: questionData.type,
                    question: questionData.question,
                    answer: questionData.answer,
                    options: questionData.options,
                    explanation: questionData.explanation,
                    areaToReview: questionData.areaToReview,
                    // @ts-ignore
                    topics: questionTopicIds
                }, extractDbQueryParams(req));
            }
            return question?._id?.toString() ?? null;
        };

        try {
            const { quizData } = req.body as { quizData: IQuizByJsonData };
            const { showTimestamps, needToPopulate }: dbQueryParams = extractDbQueryParams(req);
            const { name, topics, questions } = quizData;

            const existingQuiz: QuizModelResponse | null = await Quiz.findOne({ name });
            if (existingQuiz) {
                return handleRouteError(res, `Quiz with name ${name} already exists`);
            }

            const topicIds = await Promise.all(topics.map(getOrCreateTopic));
            const questionIds = await Promise.all(questions.map(getOrCreateQuestion));

            if (topicIds.length === 0 || questionIds.length === 0) {
                return handleRouteError(res, `Quiz must have at least one topic and one question`);
            }

            const newQuiz: QuizModelResponse = await Quiz.create({
                name,
                topics: topicIds,
                questions: questionIds
            });

            const created = await quizController.getById(newQuiz._id.toString(), { showTimestamps, needToPopulate });

            return res.status(httpStatusCodes.CREATED).json({ data: created });
        } catch (error: any) {
            console.log('CREATE QUIZ BY JSON ERROR', error.message)
            return handleRouteError(res, error.message);
        }
    }
}

export default quizRouteController;
