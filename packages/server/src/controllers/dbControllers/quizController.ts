import { Quiz } from '../../db/models';
import { createSelectTerms } from './controllerUtils';
import { dbQueryParamDefaults } from '../routeControllers/routeUtils';

import type { dbQueryParams } from '../types';
import type { IQuiz, QuizModelType, PopulatedQuizModel } from '../../db/types';


/**
 * ```ts
 *  interface IQuizController {
 *      getAll: (props:dbQueryParams) => Promise<(QuizModelResponse)[]>;
 *
 *      create: (quiz: IQuiz, queryParams:dbQueryParams) => Promise<QuizModelResponse | null>;
 *
 *      getById: (id: string, queryParams:dbQueryParams) => Promise<QuizModelResponse | null>;
 *
 *      updateById: (id: string, quiz: Partial<IQuiz>, queryParams:dbQueryParams) => Promise<QuizModelResponse | null>;
 *
 *     deleteById: (id: string, queryParams:dbQueryParams) => Promise<QuizModelResponse | null>;
 *
 *      getManyByTopics: (Topics: string[]) => Promise<PopulatedQuizModel[]>;
 *  }
 * ```
 */
export interface IQuizController {
    getAll: (props: dbQueryParams) => Promise<(QuizModelResponse)[]>;
    create: (quiz: IQuiz, queryParams: dbQueryParams) => Promise<QuizModelResponse | null>;
    getById: (id: string, queryParams: dbQueryParams) => Promise<QuizModelResponse | null>;
    updateById: (id: string, quiz: Partial<IQuiz>, queryParams: dbQueryParams) => Promise<QuizModelResponse | null>;
    deleteById: (id: string, queryParams: dbQueryParams) => Promise<QuizModelResponse | null>;
    getManyByTopics: (Topics: string[], showTimestamps?: boolean) => Promise<PopulatedQuizModel[]>;
}

export type QuizModelResponse = (PopulatedQuizModel | QuizModelType);


export const getAll = async (props: dbQueryParams): Promise<QuizModelResponse[]> => {
    const { showTimestamps, needToPopulate } = props ?? dbQueryParamDefaults;
    const selectTerms = createSelectTerms(showTimestamps);

    let quizzes: (PopulatedQuizModel | QuizModelType)[] = [];

    needToPopulate && (quizzes = await Quiz.find({}).populate([
        { path: 'topics', select: selectTerms },
        { path: 'questions', select: selectTerms, populate: { path: 'topics', select: selectTerms } }
    ]).select(selectTerms) as PopulatedQuizModel[]);

    !needToPopulate && (quizzes = await Quiz.find({}).select(selectTerms) as QuizModelType[]);

    return quizzes;
};

export const create = async (quiz: IQuiz, queryParams: dbQueryParams): Promise<QuizModelResponse | null> => {
    const { showTimestamps, needToPopulate } = queryParams ?? dbQueryParamDefaults;
    const selectTerms = createSelectTerms(showTimestamps);

    const newQuiz: QuizModelType = (await Quiz.create({ ...quiz }));

    let quizToReturn: (PopulatedQuizModel | QuizModelType) | null = null;

    needToPopulate && (quizToReturn = await Quiz.findById({ _id: newQuiz._id }).populate([
        { path: 'topics', select: selectTerms },
        { path: 'questions', select: selectTerms, populate: { path: 'topics', select: selectTerms } }
    ]).select(selectTerms) as PopulatedQuizModel);

    !needToPopulate && (quizToReturn = await Quiz.findById({ _id: newQuiz._id }).select(selectTerms) as QuizModelType);

    return quizToReturn;
};

export const getById = async (id: string, queryParams: dbQueryParams): Promise<QuizModelResponse | null> => {
    const { showTimestamps, needToPopulate } = queryParams ?? dbQueryParamDefaults;
    const selectTerms = createSelectTerms(showTimestamps);

    let quiz: PopulatedQuizModel | QuizModelType | null = null;

    needToPopulate && (quiz = await Quiz.findById({ _id: id }).populate([
        { path: 'topics', select: selectTerms },
        { path: 'questions', select: selectTerms, populate: { path: 'topics', select: selectTerms } }
    ]).select(selectTerms) as PopulatedQuizModel | null);

    !needToPopulate && (quiz = await Quiz.findById({ _id: id }).select(selectTerms) as QuizModelType | null);

    return quiz;
};

export const updateById = async (id: string, quiz: Partial<IQuiz>, queryParams: dbQueryParams): Promise<QuizModelResponse | null> => {
    const { showTimestamps, needToPopulate } = queryParams ?? dbQueryParamDefaults;
    const selectTerms = createSelectTerms(showTimestamps);

    // while we can have a partial ensure that the quiz is not an empty object
    if (Object.keys(quiz).length === 0) {
        throw new Error('Nothing to update');
    }

    // destructure the topics and questions from the quiz
    const { topics, questions, ...rest } = quiz;

    let updateOptions: any = { ...rest };
    let updatedQuiz: (PopulatedQuizModel | QuizModelType) | null = null;

    // ensure we don't overwrite topics or questions when updating
    ((topics?.length ?? 0) > 0) && (updateOptions = { ...rest, $addToSet: { topics } });

    ((questions?.length ?? 0) > 0) && (updateOptions = {
        ...updateOptions, $addToSet: { ...updateOptions.$addToSet, questions }
    });

    needToPopulate && (updatedQuiz = await Quiz.findByIdAndUpdate({ _id: id }, updateOptions, { new: true, runValidators: true })
        .populate([
            { path: 'topics', select: selectTerms },
            { path: 'questions', select: selectTerms, populate: { path: 'topics', select: selectTerms } }
        ]).select(selectTerms) as PopulatedQuizModel | null);

    !needToPopulate && (updatedQuiz = await Quiz.findByIdAndUpdate({ _id: id }, updateOptions, { new: true, runValidators: true })
        .select(selectTerms) as QuizModelType | null);

    return updatedQuiz;
};

export const deleteById = async (id: string, queryParams: dbQueryParams): Promise<QuizModelResponse | null> => {
    const { showTimestamps, needToPopulate } = queryParams ?? dbQueryParamDefaults;
    const selectTerms = createSelectTerms(showTimestamps);

    let deletedQuiz: (PopulatedQuizModel | QuizModelType) | null = null;

    needToPopulate && (deletedQuiz = await Quiz.findByIdAndDelete({ _id: id }).populate([
        { path: 'topics', select: selectTerms },
        { path: 'questions', select: selectTerms, populate: { path: 'topics', select: selectTerms } }
    ]).select(selectTerms) as PopulatedQuizModel | null);

    !needToPopulate && (deletedQuiz = await Quiz.findByIdAndDelete({ _id: id }).select(selectTerms) as QuizModelType | null);

    return deletedQuiz;
};

// Not currently exposed in a route controller
export const getManyByTopics = async (topics: string[], showTimestamps = false): Promise<PopulatedQuizModel[]> => {
    const selectTerms = createSelectTerms(showTimestamps);
    const quizzes = await Quiz.find({ topics: { $in: topics } }).populate([
        { path: 'topics', select: selectTerms },
        { path: 'questions', select: selectTerms, populate: { path: 'topics', select: selectTerms } }
    ]).select(selectTerms) as PopulatedQuizModel[];

    return quizzes;
};



const quizController: IQuizController = {
    getAll,
    create,
    getById,
    updateById,
    deleteById,
    getManyByTopics
};

export default quizController;
