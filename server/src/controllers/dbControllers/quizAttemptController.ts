import { QuizAttempt } from '../../db/models';
import { createSelectTerms } from './controllerUtils';

import type { IQuizAttempt, QuizAttemptType } from '../../db/types';

/**
 * ```ts
 * interface IQuizAttempt {
 *  getAll(showTimestamps?: boolean): Promise<QuizAttemptType[]>;
 *
 *  getById(id: string, showTimestamps?: boolean): Promise<QuizAttemptType | null>;
 *
 *  create(quizAttempt: IQuizAttempt): Promise<QuizAttemptType>;
 *
 *  updateById(id: string, quizAttempt: IQuizAttempt, showTimestamps?: boolean): Promise<QuizAttemptType | null>;
 *
 *  deleteById(id: string): Promise<QuizAttemptType | null>;
 * }
 * ```
 */
export interface IQuizAttemptController {
    getAll(showTimestamps?: boolean): Promise<QuizAttemptType[]>;
    getById(id: string, showTimestamps?: boolean): Promise<QuizAttemptType | null>;
    create(quizAttempt: IQuizAttempt): Promise<QuizAttemptType>;
    updateById(id: string, quizAttempt: Partial<IQuizAttempt>, showTimestamps?: boolean): Promise<QuizAttemptType | null>;
    deleteById(id: string): Promise<QuizAttemptType | null>;
}

export const getAll = async (showTimestamps = false): Promise<QuizAttemptType[]> => {
    const selectTerms = createSelectTerms(showTimestamps);
    const quizAttempts = await QuizAttempt.find({}).select(selectTerms);
    return quizAttempts;
}

export const getById = async (id: string, showTimestamps = false): Promise<QuizAttemptType | null> => {
    const selectTerms = createSelectTerms(showTimestamps);
    const quizAttempt = await QuizAttempt.findById(id).select(selectTerms);
    return quizAttempt;
}

export const create = async (quizAttempt: IQuizAttempt): Promise<QuizAttemptType> => {
    if (!quizAttempt.answeredQuestions) {
        throw new Error('An array of answered questions must be provided.');
    }
    const newQuizAttempt = await QuizAttempt.create(quizAttempt);

    const newAttempt = await QuizAttempt.findById({ _id: newQuizAttempt._id })
        .select(createSelectTerms(false)) as QuizAttemptType;
    return newAttempt;
}

export const updateById = async (id: string, quizAttempt: Partial<IQuizAttempt>, showTimestamps = false): Promise<QuizAttemptType | null> => {
    const selectTerms = createSelectTerms(showTimestamps);
    const updatedQuizAttempt = await QuizAttempt.findByIdAndUpdate(id, quizAttempt, {
        new: true,
        runValidators: true,
    }).select(selectTerms);
    return updatedQuizAttempt;
}

export const deleteById = async (id: string): Promise<QuizAttemptType | null> => {
    const deletedQuizAttempt = await QuizAttempt.findByIdAndDelete(id).select(createSelectTerms(false));
    return deletedQuizAttempt;
}

export const quizAttemptController: IQuizAttemptController = {
    getAll,
    getById,
    create,
    updateById,
    deleteById
};

export default quizAttemptController;
