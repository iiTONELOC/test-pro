import { IQuizQuestionJsonData } from '../../../../types';

export type parsedQuestionsType = Partial<IQuizQuestionJsonData>;
export type jsonQuizData = {
    name?: string;
    questions: parsedQuestionsType[];
    topics: string[];
};
