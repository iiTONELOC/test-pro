import { Question } from '../../db/models';
import { createSelectTerms } from './controllerUtils';
import { IQuestion, PopulatedQuestionModelType } from '../../db/types';

/**
 * ```ts
 *   type IQuestionController = {
 *      getAll: (showTimestamps?: boolean) => Promise<PopulatedQuestionModelType[]>
 *
 *      getById: (questionId: string, showTimestamps?: boolean) => Promise<PopulatedQuestionModelType>
 *
 *      create: (question: IQuestion) => Promise<PopulatedQuestionModelType>
 *
 *      updateById: (questionId: string, question: IQuestion, showTimestamps?: boolean) => Promise<PopulatedQuestionModelType>
 *
 *      deleteById: (questionId: string) => Promise<PopulatedQuestionModelType>
 *   }
 * ```
 */
export interface IQuestionController {
    getAll: (showTimestamps?: boolean) => Promise<PopulatedQuestionModelType[]>
    getById: (questionId: string, showTimestamps?: boolean) => Promise<PopulatedQuestionModelType>
    create: (question: IQuestion) => Promise<PopulatedQuestionModelType>
    updateById: (questionId: string, question: Partial<IQuestion>, showTimestamps?: boolean) => Promise<PopulatedQuestionModelType>
    deleteById: (questionId: string) => Promise<PopulatedQuestionModelType>
}

export const getAll = async (showTimestamps = false): Promise<PopulatedQuestionModelType[]> => {
    const selectTerms = createSelectTerms(showTimestamps)
    const questions: PopulatedQuestionModelType[] = await Question
        .find({}, selectTerms)
        .populate({ path: 'topics', select: selectTerms })
        .select(selectTerms) as PopulatedQuestionModelType[]
    return questions
};

export const getById = async (questionId: string, showTimestamps = false): Promise<PopulatedQuestionModelType> => {
    const selectTerms = createSelectTerms(showTimestamps);
    const question: PopulatedQuestionModelType = await Question
        .findById({ _id: questionId })
        .populate({ path: 'topics', select: selectTerms })
        .select(selectTerms) as PopulatedQuestionModelType
    return question
};

export const create = async (question: IQuestion): Promise<PopulatedQuestionModelType> => {
    const newQuestion = await Question.create(question);
    const selectTerms = createSelectTerms(false);

    const populatedQuestion: PopulatedQuestionModelType = await Question
        .findById({ _id: newQuestion._id })
        .populate({ path: 'topics', select: selectTerms })
        .select(selectTerms) as PopulatedQuestionModelType;

    return populatedQuestion;
};

export const updateById = async (questionId: string, question: Partial<IQuestion>, showTimestamps = false): Promise<PopulatedQuestionModelType> => {
    const selectTerms = createSelectTerms(showTimestamps);
    const { topics, ...rest } = question;
    let updateOptions = {};

    // ensure we don't overwrite topics when updating
    if (topics?.length === 0) {
        updateOptions = { ...rest }
    } else {
        updateOptions = { ...rest, $addToSet: { topics } }
    }

    const updatedQuestion = await Question
        .findByIdAndUpdate({ _id: questionId }, updateOptions, { new: true, runValidators: true })
        .populate({ path: 'topics', select: selectTerms })
        .select(selectTerms) as PopulatedQuestionModelType;

    return updatedQuestion;
};

export const deleteById = async (questionId: string): Promise<PopulatedQuestionModelType> => {
    const selectTerms = createSelectTerms(false);
    const deletedQuestion = await Question
        .findByIdAndDelete({ _id: questionId })
        .populate({ path: 'topics', select: selectTerms })
        .select(selectTerms) as PopulatedQuestionModelType;
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
