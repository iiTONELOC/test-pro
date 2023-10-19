import { Quiz } from '../../db/models';
import { createSelectTerms } from './controllerUtils';
import { IQuiz, QuizModelType, PopulatedQuizModel } from '../../db/types';

/**
 * ```ts
 *  interface IQuizController {
 *      getAllQuizzes: () => Promise<PopulatedQuizModel[]>;
 *      createQuiz: (quiz: IQuiz) => Promise<QuizModelType>;
 *      getQuizById: (id: string) => Promise<PopulatedQuizModel | null>;
 *      updateQuizById: (id: string, quiz: Partial<IQuiz>) => Promise<PopulatedQuizModel | null>;
 *      deleteQuizById: (id: string) => Promise<PopulatedQuizModel | null>;
 *      getQuizzesByTopics: (Topics: string[]) => Promise<PopulatedQuizModel[]>;
 *  }
 * ```
 */
export interface IQuizController {
    getAllQuizzes: (showTimestamps?: boolean) => Promise<PopulatedQuizModel[]>;
    createQuiz: (quiz: IQuiz, showTimestamps?: boolean) => Promise<PopulatedQuizModel>;
    getQuizById: (id: string, showTimestamps?: boolean) => Promise<PopulatedQuizModel | null>;
    updateQuizById: (id: string, quiz: Partial<IQuiz>, showTimestamps?: boolean) => Promise<PopulatedQuizModel | null>;
    deleteQuizById: (id: string, showTimestamps?: boolean) => Promise<PopulatedQuizModel | null>;
    getQuizzesByTopics: (Topics: string[], showTimestamps?: boolean) => Promise<PopulatedQuizModel[]>;
}

export const getAllQuizzes = async (showTimestamps = false): Promise<PopulatedQuizModel[]> => {
    const selectTerms = createSelectTerms(showTimestamps);
    const quizzes: PopulatedQuizModel[] = await Quiz.find({}).populate([
        { path: 'topics', select: selectTerms },
        { path: 'questions', select: selectTerms }
    ]).select(selectTerms) as PopulatedQuizModel[];

    return quizzes;
};

export const createQuiz = async (quiz: IQuiz, showTimestamps = false): Promise<PopulatedQuizModel> => {
    const selectTerms = createSelectTerms(showTimestamps);
    const newQuiz: QuizModelType = (await Quiz.create({ ...quiz }));
    const populatedQuiz: PopulatedQuizModel = await Quiz.findById({ _id: newQuiz._id }).populate([
        { path: 'topics', select: selectTerms },
        { path: 'questions', select: selectTerms }
    ]).select(selectTerms) as PopulatedQuizModel;

    return populatedQuiz;
};

export const getQuizById = async (id: string, showTimestamps = false): Promise<PopulatedQuizModel | null> => {
    const selectTerms = createSelectTerms(showTimestamps);
    const foundQuiz = await Quiz.findById({ _id: id }).populate([
        { path: 'topics', select: selectTerms },
        { path: 'questions', select: selectTerms }
    ]).select(selectTerms) as PopulatedQuizModel | null;

    return foundQuiz;
};

export const updateQuizById = async (id: string, quiz: Partial<IQuiz>, showTimestamps = false): Promise<PopulatedQuizModel | null> => {
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

export const deleteQuizById = async (id: string, showTimestamps = false): Promise<PopulatedQuizModel | null> => {
    const selectTerms = createSelectTerms(showTimestamps);
    const deletedQuiz = await Quiz.findByIdAndDelete({ _id: id }).populate([
        { path: 'topics', select: selectTerms },
        { path: 'questions', select: selectTerms }
    ]).select(selectTerms) as PopulatedQuizModel | null;

    return deletedQuiz;
};

export const getQuizzesByTopics = async (topics: string[], showTimestamps = false): Promise<PopulatedQuizModel[]> => {
    const selectTerms = createSelectTerms(showTimestamps);
    const quizzes = await Quiz.find({ topics: { $in: topics } }).populate([
        { path: 'topics', select: selectTerms },
        { path: 'questions', select: selectTerms }
    ]).select(selectTerms) as PopulatedQuizModel[];

    return quizzes;
};


const quizController: IQuizController = {
    getAllQuizzes,
    createQuiz,
    getQuizById,
    updateQuizById,
    deleteQuizById,
    getQuizzesByTopics
};

export default quizController;
