import { Quiz } from '../../db/models';
import { createSelectTerms } from './controllerUtils';
import { IQuiz, QuizModelType, PopulatedQuizModel } from '../../db/types';

/**
 * ```ts
 *  interface IQuizController {
 *      getAll: () => Promise<PopulatedQuizModel[]>;
 *      create: (quiz: IQuiz) => Promise<QuizModelType>;
 *      getById: (id: string) => Promise<PopulatedQuizModel | null>;
 *      updateById: (id: string, quiz: Partial<IQuiz>) => Promise<PopulatedQuizModel | null>;
 *      deleteById: (id: string) => Promise<PopulatedQuizModel | null>;
 *      geManyByTopics: (Topics: string[]) => Promise<PopulatedQuizModel[]>;
 *  }
 * ```
 */
export interface IQuizController {
    getAll: (showTimestamps?: boolean) => Promise<PopulatedQuizModel[]>;
    create: (quiz: IQuiz, showTimestamps?: boolean) => Promise<PopulatedQuizModel>;
    getById: (id: string, showTimestamps?: boolean) => Promise<PopulatedQuizModel | null>;
    updateById: (id: string, quiz: Partial<IQuiz>, showTimestamps?: boolean) => Promise<PopulatedQuizModel | null>;
    deleteById: (id: string, showTimestamps?: boolean) => Promise<PopulatedQuizModel | null>;
    geManyByTopics: (Topics: string[], showTimestamps?: boolean) => Promise<PopulatedQuizModel[]>;
}

export const getAll = async (showTimestamps = false): Promise<PopulatedQuizModel[]> => {
    const selectTerms = createSelectTerms(showTimestamps);
    const quizzes: PopulatedQuizModel[] = await Quiz.find({}).populate([
        { path: 'topics', select: selectTerms },
        { path: 'questions', select: selectTerms }
    ]).select(selectTerms) as PopulatedQuizModel[];

    return quizzes;
};

export const create = async (quiz: IQuiz, showTimestamps = false): Promise<PopulatedQuizModel> => {
    const selectTerms = createSelectTerms(showTimestamps);
    const newQuiz: QuizModelType = (await Quiz.create({ ...quiz }));
    const populatedQuiz: PopulatedQuizModel = await Quiz.findById({ _id: newQuiz._id }).populate([
        { path: 'topics', select: selectTerms },
        { path: 'questions', select: selectTerms }
    ]).select(selectTerms) as PopulatedQuizModel;

    return populatedQuiz;
};

export const getById = async (id: string, showTimestamps = false): Promise<PopulatedQuizModel | null> => {
    const selectTerms = createSelectTerms(showTimestamps);
    const foundQuiz = await Quiz.findById({ _id: id }).populate([
        { path: 'topics', select: selectTerms },
        { path: 'questions', select: selectTerms }
    ]).select(selectTerms) as PopulatedQuizModel | null;

    return foundQuiz;
};

export const updateById = async (id: string, quiz: Partial<IQuiz>, showTimestamps = false): Promise<PopulatedQuizModel | null> => {
    const selectTerms = createSelectTerms(showTimestamps);
    // while we can have a partial ensure that the quiz is not an empty object
    if (Object.keys(quiz).length === 0) {
        throw new Error('Nothing to update');
    }
    const updatedQuiz = await Quiz.findByIdAndUpdate({ _id: id }, { ...quiz }, { new: true, runValidators: true })
        .populate([
            { path: 'topics', select: selectTerms },
            { path: 'questions', select: selectTerms }
        ]).select(selectTerms) as PopulatedQuizModel | null;

    return updatedQuiz;
};

export const deleteById = async (id: string, showTimestamps = false): Promise<PopulatedQuizModel | null> => {
    const selectTerms = createSelectTerms(showTimestamps);
    const deletedQuiz = await Quiz.findByIdAndDelete({ _id: id }).populate([
        { path: 'topics', select: selectTerms },
        { path: 'questions', select: selectTerms }
    ]).select(selectTerms) as PopulatedQuizModel | null;

    return deletedQuiz;
};

export const geManyByTopics = async (topics: string[], showTimestamps = false): Promise<PopulatedQuizModel[]> => {
    const selectTerms = createSelectTerms(showTimestamps);
    const quizzes = await Quiz.find({ topics: { $in: topics } }).populate([
        { path: 'topics', select: selectTerms },
        { path: 'questions', select: selectTerms }
    ]).select(selectTerms) as PopulatedQuizModel[];

    return quizzes;
};


const quizController: IQuizController = {
    getAll,
    create,
    getById,
    updateById,
    deleteById,
    geManyByTopics
};

export default quizController;
