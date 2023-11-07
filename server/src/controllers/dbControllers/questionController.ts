import { Question } from '../../db/models';
import { createSelectTerms } from './controllerUtils';
import { dbQueryParamDefaults } from '../routeControllers/routeUtils';

import type { dbQueryParams } from '../types';
import type { IQuestion, PopulatedQuestionModelType, QuestionModelType } from '../../db/types';


/**
 * ```ts
 *   type IQuestionController = {
 *     getAll: (queryParams: dbQueryParams) => Promise<PopulatedQuestionModelType[] | QuestionModelType[]>
 *
 *      getById: (questionId: string, queryParams: dbQueryParams) => Promise<PopulatedQuestionModelType | QuestionModelType | null>
 *
 *      create: (question: IQuestion, queryParams: dbQueryParams) => Promise<PopulatedQuestionModelType | QuestionModelType | null>
 *
 *     updateById: (questionId: string, question: Partial<IQuestion>, queryParams: dbQueryParams) => Promise<PopulatedQuestionModelType | QuestionModelType | null>
 *
 *      deleteById: (questionId: string, queryParams: dbQueryParams) => Promise<PopulatedQuestionModelType| QuestionModelType| null>
 *   }
 * ```
 */
export interface IQuestionController {
    getAll: (queryParams: dbQueryParams) => Promise<QuestionModelResponse[]>
    getById: (questionId: string, queryParams: dbQueryParams) => Promise<QuestionModelResponse | null>
    create: (question: IQuestion, queryParams: dbQueryParams) => Promise<QuestionModelResponse | null>
    updateById: (questionId: string, question: Partial<IQuestion>, queryParams: dbQueryParams) => Promise<QuestionModelResponse | null>
    deleteById: (questionId: string, queryParams: dbQueryParams) => Promise<QuestionModelResponse | null>
}

export type QuestionModelResponse = (PopulatedQuestionModelType | QuestionModelType)

export const getAll = async (queryParams: dbQueryParams): Promise<QuestionModelResponse[]> => {
    const { showTimestamps, needToPopulate } = queryParams ?? dbQueryParamDefaults;
    const selectTerms = createSelectTerms(showTimestamps)

    let questions: PopulatedQuestionModelType[] | QuestionModelType[] = [];

    needToPopulate && (questions = await Question
        .find({}, selectTerms)
        .populate({ path: 'topics', select: selectTerms })
        .select(selectTerms) as PopulatedQuestionModelType[]);

    !needToPopulate && (questions = await Question.find({}, selectTerms).select(selectTerms) as QuestionModelType[]);

    return questions
};

export const getById = async (questionId: string, queryParams: dbQueryParams): Promise<QuestionModelResponse | null> => {
    const { showTimestamps, needToPopulate } = queryParams ?? dbQueryParamDefaults;
    const selectTerms = createSelectTerms(showTimestamps);

    let question: QuestionModelResponse | null = null;

    needToPopulate && (question = await Question
        .findById({ _id: questionId })
        .populate({ path: 'topics', select: selectTerms })
        .select(selectTerms) as PopulatedQuestionModelType);

    !needToPopulate && (question = await Question.findById({ _id: questionId }).select(selectTerms) as QuestionModelType);

    return question
};


export const create = async (question: IQuestion, queryParams: dbQueryParams): Promise<QuestionModelResponse | null> => {
    const { showTimestamps, needToPopulate } = queryParams ?? dbQueryParamDefaults;
    const selectTerms = createSelectTerms(showTimestamps);

    const newQuestion = await Question.create(question);

    let questionToReturn: QuestionModelResponse | null = null;

    needToPopulate && (questionToReturn = await Question
        .findById({ _id: newQuestion._id })
        .populate({ path: 'topics', select: selectTerms })
        .select(selectTerms) as PopulatedQuestionModelType);

    !needToPopulate && (questionToReturn = await Question.findById({ _id: newQuestion._id }).select(selectTerms) as QuestionModelType);

    return questionToReturn;
};

export const updateById = async (questionId: string, question: Partial<IQuestion>, queryParams: dbQueryParams): Promise<QuestionModelResponse | null> => {
    const { showTimestamps, needToPopulate } = queryParams ?? dbQueryParamDefaults;
    const selectTerms = createSelectTerms(showTimestamps);
    const { topics, ...rest } = question;

    let updateOptions = {};

    // ensure we don't overwrite topics when updating
    topics?.length === 0 && (updateOptions = { ...rest })

    topics?.length !== 0 && (updateOptions = { ...rest, $addToSet: { topics } })

    let updatedQuestion: QuestionModelResponse | null = null;

    needToPopulate && (updatedQuestion = await Question
        .findByIdAndUpdate({ _id: questionId }, updateOptions, { new: true, runValidators: true })
        .populate({ path: 'topics', select: selectTerms })
        .select(selectTerms) as PopulatedQuestionModelType);

    !needToPopulate && (updatedQuestion = await Question
        .findByIdAndUpdate({ _id: questionId }, updateOptions, { new: true, runValidators: true })
        .select(selectTerms) as QuestionModelType);

    return updatedQuestion;
};

export const deleteById = async (questionId: string, queryParams: dbQueryParams): Promise<QuestionModelResponse | null> => {
    const { showTimestamps, needToPopulate } = queryParams ?? dbQueryParamDefaults;
    const selectTerms = createSelectTerms(showTimestamps);

    let deletedQuestion: QuestionModelResponse | null = null;

    needToPopulate && (deletedQuestion = await Question
        .findByIdAndDelete({ _id: questionId })
        .populate({ path: 'topics', select: selectTerms })
        .select(selectTerms) as PopulatedQuestionModelType);

    !needToPopulate && (deletedQuestion = await Question
        .findByIdAndDelete({ _id: questionId })
        .select(selectTerms) as QuestionModelType);

    return deletedQuestion;
};

const questionController: IQuestionController = {
    getAll,
    getById,
    create,
    updateById,
    deleteById
}

export default questionController;
