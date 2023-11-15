import { signal, Signal } from '@preact/signals';
import { QuizViews } from '../components/QuizView/ViewRouter';

const CurrentQuizView = signal<QuizViews>(QuizViews.QuizDetails);


export type QuizViewSignal = {
    currentQuizView: Signal<QuizViews>;
    setCurrentQuizView: (view: QuizViews) => void;
};


export const useQuizViewSignal = (): QuizViewSignal => {
    const setCurrentQuizView = (view: QuizViews) => {
        CurrentQuizView.value = view;
    };

    return { currentQuizView: CurrentQuizView, setCurrentQuizView };
};

export { QuizViews };
