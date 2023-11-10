import { signal, Signal } from '@preact/signals';
import { QuizModelResponse } from '../utils/api';

const Quizzes = signal<QuizModelResponse[]>([]);

export type QuizzesDbState = {
    quizzesDb: Signal<QuizModelResponse[]>;
    setQuizzes: (quizzes: QuizModelResponse[]) => void;
    setQuiz: (quiz: QuizModelResponse) => void;
    addQuiz: (quiz: QuizModelResponse) => void;
};

export const useQuizzesDbState = (): QuizzesDbState => {
    const setQuizzes = (quizzes: QuizModelResponse[]) => {
        Quizzes.value = [...Quizzes.value, ...quizzes];
    };

    const setQuiz = (quiz: QuizModelResponse) => {
        const quizzes = Quizzes.value;
        const quizIndex = quizzes.findIndex(q => q._id === quiz._id);
        if (quizIndex > -1) {
            quizzes[quizIndex] = quiz;
            Quizzes.value = quizzes;
        } else {
            addQuiz(quiz);
        }
    };

    const addQuiz = (quiz: QuizModelResponse) => {
        const quizzes = Quizzes.value;
        // only add the quiz if it doesn't already exist
        if (!quizzes.some(q => q._id === quiz._id)) {
            Quizzes.value = [...quizzes, quiz];
        }
    };

    return { quizzesDb: Quizzes, setQuizzes, setQuiz, addQuiz };
};
