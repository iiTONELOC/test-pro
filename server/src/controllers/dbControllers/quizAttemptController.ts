import { QuizAttempt, QuizQuestionResult } from '../../db/models';
import { dbQueryParamDefaults } from '../routeControllers/routeUtils';
import { createSelectTerms } from './controllerUtils';

import type { IQuizAttempt, PopulatedQuizAttemptType, QuizAttemptType } from '../../db/types';
import type { dbQueryParams } from '../types';


/**
 * ```ts
 * interface IQuizAttempt {
 *    getAll(queryParams: dbQueryParams): Promise<QuizAttemptModelResponse[]>;
 *    getById(id: string, queryParams: dbQueryParams): Promise<QuizAttemptModelResponse | null>;
 *    create(quizAttempt: IQuizAttempt, queryParams: dbQueryParams): Promise<QuizAttemptModelResponse | null>;
 *    updateById(id: string, quizAttempt: Partial<IQuizAttempt>, queryParams: dbQueryParams): Promise<QuizAttemptModelResponse | null>;
 *    deleteById(id: string, queryParams: dbQueryParams): Promise<QuizAttemptModelResponse | null>;
 *    getByQuizId(quizId: string, queryParams: dbQueryParams): Promise<QuizAttemptModelResponse[]>;
 * }
 * ```
 */
export interface IQuizAttemptController {
    getAll(queryParams: dbQueryParams): Promise<QuizAttemptModelResponse[]>;
    getById(id: string, queryParams: dbQueryParams): Promise<QuizAttemptModelResponse | null>;
    create(quizAttempt: IQuizAttempt, queryParams: dbQueryParams): Promise<QuizAttemptModelResponse | null>;
    updateById(id: string, quizAttempt: Partial<IQuizAttempt>, queryParams: dbQueryParams): Promise<QuizAttemptModelResponse | null>;
    deleteById(id: string, queryParams: dbQueryParams): Promise<QuizAttemptModelResponse | null>;
    getByQuizId(quizId: string, queryParams: dbQueryParams): Promise<QuizAttemptModelResponse[]>;
}

export type QuizAttemptModelResponse = (PopulatedQuizAttemptType | QuizAttemptType)

export const getAll = async (queryParams: dbQueryParams): Promise<QuizAttemptModelResponse[]> => {
    const { showTimestamps, needToPopulate } = queryParams ?? dbQueryParamDefaults;
    const selectTerms = createSelectTerms(showTimestamps);

    let quizAttempts: PopulatedQuizAttemptType[] | QuizAttemptType[] = [];

    needToPopulate && (quizAttempts = await QuizAttempt.find().select(selectTerms).populate({
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
    }) as PopulatedQuizAttemptType[]);

    !needToPopulate && (quizAttempts = await QuizAttempt.find().select(selectTerms) as QuizAttemptType[]);

    return quizAttempts;
};

export const getById = async (id: string, queryParams: dbQueryParams): Promise<QuizAttemptModelResponse | null> => {
    const { showTimestamps, needToPopulate } = queryParams ?? dbQueryParamDefaults;
    const selectTerms = createSelectTerms(showTimestamps);

    let quizAttempt: QuizAttemptModelResponse | null = null;

    needToPopulate && (quizAttempt = await QuizAttempt.findById(id).select(selectTerms).populate({
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
    }) as PopulatedQuizAttemptType | null);

    !needToPopulate && (quizAttempt = await QuizAttempt.findById(id).select(selectTerms) as QuizAttemptType | null);
    return quizAttempt;
};

export const create = async (quizAttempt: IQuizAttempt, queryParams: dbQueryParams): Promise<QuizAttemptModelResponse | null> => {
    const { showTimestamps, needToPopulate } = queryParams ?? dbQueryParamDefaults;
    const selectTerms = createSelectTerms(showTimestamps);

    if (!quizAttempt.answeredQuestions) {
        throw new Error('An array of answered questions must be provided.');
    }
    const newQuizAttempt = await QuizAttempt.create(quizAttempt);

    let attempt: QuizAttemptModelResponse | null = null;

    needToPopulate && (attempt = await QuizAttempt.findById({ _id: newQuizAttempt._id })
        .select(selectTerms).populate({
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
        }) as PopulatedQuizAttemptType);

    !needToPopulate && (attempt = await QuizAttempt.findById({ _id: newQuizAttempt._id }).select(selectTerms) as QuizAttemptType);

    return attempt;
};

export const updateById = async (id: string, quizAttempt: Partial<IQuizAttempt>, queryParams: dbQueryParams): Promise<QuizAttemptModelResponse | null> => {
    const { showTimestamps, needToPopulate } = queryParams ?? dbQueryParamDefaults;
    const selectTerms = createSelectTerms(showTimestamps);

    const { answeredQuestions, ...rest } = quizAttempt;
    let updateOptions = {};
    let updatedQuizAttempt: QuizAttemptModelResponse | null = null;

    if (answeredQuestions?.length === 0) {
        updateOptions = { ...rest };
    } else {
        updateOptions = { ...rest, $addToSet: { answeredQuestions } };
    }

    needToPopulate && (updatedQuizAttempt = await QuizAttempt.findByIdAndUpdate(id, updateOptions, {
        new: true,
        runValidators: true
    }).select(selectTerms).populate({
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
    }) as PopulatedQuizAttemptType | null);

    !needToPopulate && (updatedQuizAttempt = await QuizAttempt
        .findByIdAndUpdate(id, updateOptions, { new: true, runValidators: true })
        .select(selectTerms) as QuizAttemptType | null);

    return updatedQuizAttempt;
};

export const deleteById = async (id: string, queryParams: dbQueryParams): Promise<QuizAttemptModelResponse | null> => {
    const { showTimestamps, needToPopulate } = queryParams ?? dbQueryParamDefaults;

    const deletedQuestionResults = await QuizQuestionResult.deleteMany({ quizAttempt: id });
    if (!deletedQuestionResults) throw new Error('Unable to delete quiz question results.');
    const selectTerms = createSelectTerms(showTimestamps);

    let deletedQuizAttempt: QuizAttemptModelResponse | null = null;

    needToPopulate && (deletedQuizAttempt = await QuizAttempt.findByIdAndDelete(id)
        .select(selectTerms).populate({
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
        }) as PopulatedQuizAttemptType | null);

    !needToPopulate && (deletedQuizAttempt = await QuizAttempt.findByIdAndDelete(id).select(selectTerms) as QuizAttemptType | null);

    return deletedQuizAttempt;
};

export const getByQuizId = async (quizId: string, queryParams: dbQueryParams): Promise<QuizAttemptModelResponse[]> => {
    const { showTimestamps, needToPopulate } = queryParams ?? dbQueryParamDefaults;
    const selectTerms = createSelectTerms(showTimestamps);

    let quizAttempts: QuizAttemptModelResponse[] | null = null;

    needToPopulate && (quizAttempts = await QuizAttempt.find({ quizId }).select(selectTerms).populate({
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
    }) as PopulatedQuizAttemptType[]);

    !needToPopulate && (quizAttempts = await QuizAttempt.find({ quizId }, selectTerms).select(selectTerms) as QuizAttemptType[])

    return quizAttempts ?? [];
};

export const quizAttemptController: IQuizAttemptController = {
    getAll,
    getById,
    create,
    updateById,
    deleteById,
    getByQuizId
};

export default quizAttemptController;
