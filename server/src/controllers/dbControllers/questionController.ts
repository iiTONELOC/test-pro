import { Question } from '../../db/models';
import { createSelectTerms } from './controllerUtils';
import { IQuestion, PopulatedQuestionModelType } from '../../db/types';

/**
 * ```ts
 *   type IQuestionController = {
 *      getAllQuestions: (showTimestamps?: boolean) => Promise<PopulatedQuestionModelType[]>
 *
 *      getQuestionById: (questionId: string, showTimestamps?: boolean) => Promise<PopulatedQuestionModelType>
 *
 *      createQuestion: (question: IQuestion) => Promise<PopulatedQuestionModelType>
 *
 *      updateQuestionById: (questionId: string, question: IQuestion, showTimestamps?: boolean) => Promise<PopulatedQuestionModelType>
 *
 *      deleteQuestionById: (questionId: string) => Promise<PopulatedQuestionModelType>
 *   }
 * ```
 */
export interface IQuestionController {
    getAllQuestions: (showTimestamps?: boolean) => Promise<PopulatedQuestionModelType[]>
    getQuestionById: (questionId: string, showTimestamps?: boolean) => Promise<PopulatedQuestionModelType>
    createQuestion: (question: IQuestion) => Promise<PopulatedQuestionModelType>
    updateQuestionById: (questionId: string, question: Partial<IQuestion>, showTimestamps?: boolean) => Promise<PopulatedQuestionModelType>
    deleteQuestionById: (questionId: string) => Promise<PopulatedQuestionModelType>
}

export const getAllQuestions = async (showTimestamps = false): Promise<PopulatedQuestionModelType[]> => {
    const selectTerms = createSelectTerms(showTimestamps)
    const questions: PopulatedQuestionModelType[] = await Question
        .find({}, selectTerms)
        .populate({ path: 'topics', select: selectTerms })
        .select(selectTerms) as PopulatedQuestionModelType[]
    return questions
};

export const getQuestionById = async (questionId: string, showTimestamps = false): Promise<PopulatedQuestionModelType> => {
    const selectTerms = createSelectTerms(showTimestamps);
    const question: PopulatedQuestionModelType = await Question
        .findById({ _id: questionId })
        .populate({ path: 'topics', select: selectTerms })
        .select(selectTerms) as PopulatedQuestionModelType
    return question
};

export const createQuestion = async (question: IQuestion): Promise<PopulatedQuestionModelType> => {
    const newQuestion = await Question.create(question);
    const selectTerms = createSelectTerms(false);

    const populatedQuestion: PopulatedQuestionModelType = await Question
        .findById({ _id: newQuestion._id })
        .populate({ path: 'topics', select: selectTerms })
        .select(selectTerms) as PopulatedQuestionModelType;

    return populatedQuestion;
};

export const updateQuestionById = async (questionId: string, question: Partial<IQuestion>, showTimestamps = false): Promise<PopulatedQuestionModelType> => {
    const selectTerms = createSelectTerms(showTimestamps);

    const updatedQuestion = await Question
        .findByIdAndUpdate({ _id: questionId }, question, { new: true, runValidators: true })
        .populate({ path: 'topics', select: selectTerms })
        .select(selectTerms) as PopulatedQuestionModelType;

    return updatedQuestion;
};

export const deleteQuestionById = async (questionId: string): Promise<PopulatedQuestionModelType> => {
    const selectTerms = createSelectTerms(false);
    const deletedQuestion = await Question
        .findByIdAndDelete({ _id: questionId })
        .populate({ path: 'topics', select: selectTerms })
        .select(selectTerms) as PopulatedQuestionModelType;
    return deletedQuestion;
};

const questionController: IQuestionController = {
    getAllQuestions,
    getQuestionById,
    createQuestion,
    updateQuestionById,
    deleteQuestionById
}

export default questionController;
