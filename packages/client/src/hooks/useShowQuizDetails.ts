import { useQuizViewSignal, QuizViews, useCurrentFileSignal } from '../signals';

export function useShowQuizDetails(): boolean { //NOSONAR
    const { currentQuizView } = useQuizViewSignal();
    const { fileDetails } = useCurrentFileSignal();

    return currentQuizView.value === QuizViews.QuizDetails && !!fileDetails.value;
}
