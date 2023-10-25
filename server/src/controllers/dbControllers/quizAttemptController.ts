import { QuizAttempt, QuizQuestionResult } from '../../db/models';
import { createSelectTerms } from './controllerUtils';

import type { IQuizAttempt, PopulatedQuizAttemptType } from '../../db/types';

/**
 * ```ts
 * interface IQuizAttempt {
 *  getAll(showTimestamps?: boolean): Promise<PopulatedQuizAttemptType[]>;
 *
 *  getById(id: string, showTimestamps?: boolean): Promise<PopulatedQuizAttemptType | null>;
 *
 *  create(quizAttempt: IQuizAttempt, showTimestamps?: boolean): Promise<PopulatedQuizAttemptType>;
 *
 *  updateById(id: string, quizAttempt: IQuizAttempt, showTimestamps?: boolean): Promise<PopulatedQuizAttemptType | null>;
 *
 *  deleteById(id: string, showTimestamps?: boolean): Promise<PopulatedQuizAttemptType | null>;
 * }
 * ```
 */
export interface IQuizAttemptController {
    getAll(showTimestamps?: boolean): Promise<PopulatedQuizAttemptType[]>;
    getById(id: string, showTimestamps?: boolean): Promise<PopulatedQuizAttemptType | null>;
    create(quizAttempt: IQuizAttempt, showTimestamps?: boolean): Promise<PopulatedQuizAttemptType>;
    updateById(id: string, quizAttempt: Partial<IQuizAttempt>, showTimestamps?: boolean): Promise<PopulatedQuizAttemptType | null>;
    deleteById(id: string, showTimestamps?: boolean): Promise<PopulatedQuizAttemptType | null>;
    getByQuizId(quizId: string, showTimestamps?: boolean): Promise<PopulatedQuizAttemptType[]>;
}

export const getAll = async (showTimestamps = false): Promise<PopulatedQuizAttemptType[]> => {
    const selectTerms = createSelectTerms(showTimestamps);
    const quizAttempts = await QuizAttempt.find().select(selectTerms).populate({
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
    }) as PopulatedQuizAttemptType[];
    return quizAttempts;
};

export const getById = async (id: string, showTimestamps = false): Promise<PopulatedQuizAttemptType | null> => {
    const selectTerms = createSelectTerms(showTimestamps);
    const quizAttempt = await QuizAttempt.findById(id).select(selectTerms).populate({
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
    }) as PopulatedQuizAttemptType | null;
    return quizAttempt;
};

export const create = async (quizAttempt: IQuizAttempt, showTimestamps = false): Promise<PopulatedQuizAttemptType> => {
    if (!quizAttempt.answeredQuestions) {
        throw new Error('An array of answered questions must be provided.');
    }
    const newQuizAttempt = await QuizAttempt.create(quizAttempt);
    const selectTerms = createSelectTerms(showTimestamps);

    const newAttempt = await QuizAttempt.findById({ _id: newQuizAttempt._id })
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
        }) as PopulatedQuizAttemptType;
    return newAttempt;
};

export const updateById = async (id: string, quizAttempt: Partial<IQuizAttempt>, showTimestamps = false): Promise<PopulatedQuizAttemptType | null> => {
    const selectTerms = createSelectTerms(showTimestamps);

    const { answeredQuestions, ...rest } = quizAttempt;
    let updateOptions = {};

    // ensure that answeredQuestions is not overwritten when 
    if (answeredQuestions?.length === 0) {
        updateOptions = { ...rest };
    } else {
        updateOptions = { ...rest, $addToSet: { answeredQuestions } };
    }

    const updatedQuizAttempt = await QuizAttempt.findByIdAndUpdate(id, updateOptions, {
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
    }) as PopulatedQuizAttemptType | null;
    return updatedQuizAttempt;
};

export const deleteById = async (id: string, showTimestamps = false): Promise<PopulatedQuizAttemptType | null> => {
    const deletedQuestionResults = await QuizQuestionResult.deleteMany({ quizAttempt: id });
    if (!deletedQuestionResults) throw new Error('Unable to delete quiz question results.');

    const selectTerms = createSelectTerms(showTimestamps);
    const deletedQuizAttempt = await QuizAttempt.findByIdAndDelete(id)
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
        }) as PopulatedQuizAttemptType | null;
    return deletedQuizAttempt;
};

export const getByQuizId = async (quizId: string, showTimestamps = false): Promise<PopulatedQuizAttemptType[]> => {
    const selectTerms = createSelectTerms(showTimestamps);

    const quizAttempts = await QuizAttempt.find({ quizId }).select(selectTerms).populate({
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
    }) as PopulatedQuizAttemptType[];
    return quizAttempts;
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
