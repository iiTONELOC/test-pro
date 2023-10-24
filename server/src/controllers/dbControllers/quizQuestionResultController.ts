import { QuizQuestionResult } from '../../db/models';
import { createSelectTerms } from './controllerUtils';
import type { IQuizQuestionResult, QuizQuestionResultType } from '../../db/models/types';

/**
 * ```ts
 *  interface IQuizQuestionResultController {
 *      getAll: () => Promise<QuizQuestionResultType[]>;
 *
 *      getById: (id: string) => Promise<QuizQuestionResultType | null>;
 *
 *      create: (quizQuestionResult: IQuizQuestionResult) => Promise<QuizQuestionResultType>;
 *
 *      deleteById: (id: string) => Promise<QuizQuestionResultType | null>;
 *  }
 * ```
 */
export interface IQuizQuestionResultController {
    getAll: (showTimestamps?: boolean) => Promise<QuizQuestionResultType[]>;
    getById: (id: string, showTimestamps?: boolean) => Promise<QuizQuestionResultType | null>;
    create: (quizQuestionResult: IQuizQuestionResult) => Promise<QuizQuestionResultType>;
    deleteById: (id: string) => Promise<QuizQuestionResultType | null>;
}


export const getAll = async (showTimestamps = false): Promise<QuizQuestionResultType[]> => {
    const selectTerms = createSelectTerms(showTimestamps);
    const quizQuestionResults: QuizQuestionResultType[] = await QuizQuestionResult.find({}).select(selectTerms) as QuizQuestionResultType[];

    return quizQuestionResults;
};

export const getById = async (id: string, showTimestamps = false): Promise<QuizQuestionResultType | null> => {
    const selectTerms = createSelectTerms(showTimestamps);
    const foundQuizQuestionResult = await QuizQuestionResult.findById({ _id: id }).select(selectTerms) as QuizQuestionResultType | null;
    return foundQuizQuestionResult;
};

export const create = async (quizQuestionResult: IQuizQuestionResult): Promise<QuizQuestionResultType> => {
    const newQuizQuestionResult = await QuizQuestionResult.create(quizQuestionResult);
    const selectTerms = createSelectTerms(false);

    const populatedQuizQuestionResult: QuizQuestionResultType = await QuizQuestionResult.findById({ _id: newQuizQuestionResult._id }).select(selectTerms) as QuizQuestionResultType;
    return populatedQuizQuestionResult;
};

export const deleteById = async (id: string): Promise<QuizQuestionResultType | null> => {
    const deletedQuizQuestionResult = await QuizQuestionResult.findByIdAndDelete({ _id: id })
        .select(createSelectTerms(false));
    return deletedQuizQuestionResult;
};

export const quizQuestionResultController: IQuizQuestionResultController = {
    getAll,
    getById,
    create,
    deleteById
};

export default quizQuestionResultController;
