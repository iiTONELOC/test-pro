import { alfred } from '../../bot';
import { Request, Response } from 'express';
import { Topic, Quiz, Question } from '../../db/models';
import { quizController, questionController } from '../dbControllers';
import { handleRouteError, httpStatusCodes, extractDbQueryParams } from './routeUtils';

import type { IApiResponse, QuizModelResponse, dbQueryParams } from '../types';
import { QuestionTypeEnums } from '../../db/types';
import { quizType } from '../../bot/types';
import { jsonQuizData } from '../../bot/alfred/utils/types';



/**
 * ```ts
 * interface IQuizQuestionJsonData {
 *    type: QuestionTypeEnums
 *    question: string;
 *    topics: string[];
 *    answer: string
 *    options: string[];
 *    matchOptions?: string[] | null,
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
    matchOptions?: string[] | null,
    explanation: string;
    areaToReview: string[];
}

/**
 * ```ts
 * enum QuestionTypeEnums  {
 *     MultipleChoice = 'MultipleChoice',
 *     FillInTheBlank = 'FillInTheBlank',
 *     ShortAnswer = 'ShortAnswer',
 *     Matching = 'Matching',
 *     Ordering = 'Ordering',
 *     Image = 'Image'
 *  }
 * ```
 */
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
 *      matchOptions?: string[] | null,
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
    convertTextToJSON: (req: Request, res: Response) => Promise<IApiResponse<(QuizModelResponse)>>;
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
        const getOrCreateTopic = async (topicName: string): Promise<string | null> => {
            let topic = await Topic.findOne({ name: topicName });
            if (!topic) {
                try {
                    topic = await Topic.create({ name: topicName });
                } catch (error) {
                    topic = await Topic.findOne({ name: topicName });
                }

            }
            return topic?._id.toString() ?? null;
        };

        const getOrCreateQuestion = async (questionData: IQuizQuestionJsonData): Promise<string | null> => {

            let question = await Question.findOne({ question: questionData.question });

            if (!question) {
                const questionTopicIds = await Promise.all(questionData.topics.map(getOrCreateTopic).filter(Boolean));
                question = await questionController.create({
                    questionType: questionData.type,
                    question: questionData.question,
                    answer: questionData.answer,
                    options: questionData.options,
                    explanation: questionData.explanation,
                    areaToReview: questionData.areaToReview,
                    matchOptions: questionData.matchOptions ?? [],
                    // @ts-ignore
                    topics: questionTopicIds
                }, extractDbQueryParams(req));
            }
            return question?._id?.toString() ?? null;
        };

        try {
            const { quizData } = req.body as { quizData: IQuizByJsonData };
            const { showTimestamps, needToPopulate }: dbQueryParams = extractDbQueryParams(req);
            const { name, topics, questions } = quizData ?? {};

            const existingQuiz: QuizModelResponse | null = await Quiz.findOne({ name });
            if (existingQuiz) {
                return handleRouteError(res, `Quiz with name ${name} already exists`);
            }

            const topicIds = await Promise.all(topics.map(getOrCreateTopic).filter(Boolean));
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
    },
    convertTextToJSON: async (req: Request, res: Response): Promise<IApiResponse<(QuizModelResponse)>> => {
        try {
            const { text, quizType, name } = req.body as { text: string, quizType: string, name: string };

            const converted: jsonQuizData[] = await alfred.generateQuizJsonFromText(text, quizType as quizType);

            // the converted may contain multiple quizzes, so we need to create the json object for each quiz
            // which means we need to add the title to each quiz but we need to make sure the title is unique
            // we will do this by using a numbering system appended to the end of the title
            let quizzes: jsonQuizData[] = [];
            const numberOfQuizzes = converted.length;

            if (numberOfQuizzes > 1) {
                const quizTitles = Array.from({ length: numberOfQuizzes }, (_, i) => `${name} ${i + 1}`);

                // loop over the converted quizzes and add the title to each one
                quizzes = converted.map((quiz, i) => {
                    quiz.name = quizTitles[i];
                    return quiz;
                });
            } else {
                // if there is only one quiz then we don't need to append a number to the end of the title
                quizzes = converted.map(quiz => {
                    quiz.name = name;
                    return quiz;
                });
            }

            return res.status(httpStatusCodes.OK).json({ data: quizzes });
        } catch (error: any) {
            console.log('CONVERT TEXT TO JSON ERROR\n\n', error)
            return handleRouteError(res, error.message);
        }
    }
}

export default quizRouteController;
