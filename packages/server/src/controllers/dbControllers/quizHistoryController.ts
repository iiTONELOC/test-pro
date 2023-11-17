import { QuizAttempt, QuizHistory } from '../../db/models';
import { createSelectTerms } from './controllerUtils';
import { dbQueryParamDefaults } from '../routeControllers/routeUtils';

import type { dbQueryParams } from '../types';
import type { IQuizHistory, QuizHistoryType, PopulatedQuizHistoryType } from '../../db/types';


/**
 * ```ts
 * interface IQuizHistoryController {
 *      getAll: (queryParams: dbQueryParams) => Promise<QuizHistoryType[]>;
 *
 *      create: (quizHistory: IQuizHistory, queryParams: dbQueryParams) => Promise<QuizHistoryType | null>;
 *
 *      getById: (id: string, queryParams: dbQueryParams) => Promise<QuizHistoryType | null>;
 *
 *      deleteById: (id: string, queryParams: dbQueryParams) => Promise<QuizHistoryType | null>;
 * }
 * ```
 */
export interface IQuizHistoryController {
    getAll: (queryParams: dbQueryParams) => Promise<QuizHistoryType[]>;
    create: (quizHistory: IQuizHistory, queryParams: dbQueryParams) => Promise<QuizHistoryType | null>;
    getById: (id: string, queryParams: dbQueryParams) => Promise<QuizHistoryType | null>;
    deleteById: (id: string, queryParams: dbQueryParams) => Promise<QuizHistoryType | null>;
}

export type QuizHistoryModelResponse = (QuizHistoryType | PopulatedQuizHistoryType);


export const getAll = async (queryParams: dbQueryParams): Promise<QuizHistoryModelResponse[]> => {
    const { showTimestamps, needToPopulate } = queryParams ?? dbQueryParamDefaults;
    const selectTerms = createSelectTerms(showTimestamps);

    let quizHistories: QuizHistoryModelResponse[] = [];

    needToPopulate && (quizHistories = await QuizHistory.find().populate({
        path: 'attempt',
        select: selectTerms,
        populate: {
            path: 'answeredQuestions',
            select: selectTerms,
            populate: {
                path: 'question',
                select: selectTerms,
                populate: {
                    path: 'topics',
                    select: selectTerms
                }
            }
        }
    }) as PopulatedQuizHistoryType[]);

    !needToPopulate && (quizHistories = await QuizHistory.find().select(selectTerms) as QuizHistoryType[]);

    return quizHistories;
}

export const create = async (quizHistory: IQuizHistory, queryParams: dbQueryParams): Promise<QuizHistoryModelResponse | null> => {
    const { showTimestamps, needToPopulate } = queryParams ?? dbQueryParamDefaults;
    const selectTerms = createSelectTerms(showTimestamps);

    let newQuizHistory: QuizHistoryModelResponse | null = null;

    // verify that the quizAttempt value was provided and that it exists in the database
    const quizAttemptId = quizHistory.attempt
    if (!quizAttemptId) throw new Error('A Quiz attempt is required');

    const quizAttempt = await QuizAttempt.findOne({ _id: quizHistory.attempt });
    if (!quizAttempt) throw new Error('QuizAttempt not found');

    // create the quizHistory
    const created = await QuizHistory.create(quizHistory);

    needToPopulate && (newQuizHistory = await QuizHistory.findById({ _id: created._id }).populate({
        path: 'attempt',
        select: selectTerms,
        populate: {
            path: 'answeredQuestions',
            select: selectTerms,
            populate: {
                path: 'question',
                select: selectTerms,
                populate: {
                    path: 'topics',
                    select: selectTerms
                }
            }
        }
    }).select(selectTerms) as PopulatedQuizHistoryType);

    !needToPopulate && (newQuizHistory = await QuizHistory.findById({ _id: created._id }).select(selectTerms) as QuizHistoryType);

    return newQuizHistory;
};

export const getById = async (id: string, queryParams: dbQueryParams): Promise<QuizHistoryModelResponse | null> => {
    const { showTimestamps, needToPopulate } = queryParams ?? dbQueryParamDefaults;
    const selectTerms = createSelectTerms(showTimestamps);

    let quizHistory: QuizHistoryModelResponse | null = null;

    needToPopulate && (quizHistory = await QuizHistory.findById({ _id: id }).populate({
        path: 'attempt',
        select: selectTerms,
        populate: {
            path: 'answeredQuestions',
            select: selectTerms,
            populate: {
                path: 'question',
                select: selectTerms,
                populate: {
                    path: 'topics',
                    select: selectTerms
                }
            }
        }
    }).select(selectTerms) as PopulatedQuizHistoryType);

    !needToPopulate && (quizHistory = await QuizHistory.findById({ _id: id }).select(selectTerms) as QuizHistoryType);

    return quizHistory;
};

export const deleteById = async (id: string, queryParams: dbQueryParams): Promise<QuizHistoryModelResponse | null> => {
    const { showTimestamps, needToPopulate } = queryParams ?? dbQueryParamDefaults;
    const selectTerms = createSelectTerms(showTimestamps);

    let deletedQuizHistory: QuizHistoryModelResponse | null = null;

    needToPopulate && (deletedQuizHistory = await QuizHistory.findByIdAndDelete({ _id: id }).populate({
        path: 'attempt',
        select: selectTerms,
        populate: {
            path: 'answeredQuestions',
            select: selectTerms,
            populate: {
                path: 'question',
                select: selectTerms,
                populate: {
                    path: 'topics',
                    select: selectTerms
                }
            }
        }
    }).select(selectTerms) as PopulatedQuizHistoryType);

    !needToPopulate && (deletedQuizHistory = await QuizHistory.findByIdAndDelete({ _id: id }).select(selectTerms) as QuizHistoryType);

    // delete the associated quizAttempt
    if (deletedQuizHistory) {
        const quizAttemptId = deletedQuizHistory.attempt?._id;
        if (quizAttemptId) {
            await QuizAttempt.findByIdAndDelete({ _id: quizAttemptId });
        }
    }
    return deletedQuizHistory;
};

export const QuizHistoryController: IQuizHistoryController = {
    getAll,
    create,
    getById,
    deleteById
};

export default QuizHistoryController;
