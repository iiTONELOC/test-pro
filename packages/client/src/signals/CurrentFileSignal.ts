import { useSelectedFileSignal, useQuizzesDbSignal } from '.';
import { effect, signal, Signal } from '@preact/signals';
import { QuizModelResponse } from '../utils';
import { useMountedState } from '../hooks';

const currentFileDetailsSignal = signal<QuizModelResponse | null>(null);

export type CurrentFileSignal = {
    fileDetails: Signal<QuizModelResponse | null>;
};

export const useCurrentFileSignal = (): CurrentFileSignal => {
    const { selectedFile } = useSelectedFileSignal();
    const { quizzesDb } = useQuizzesDbSignal();
    const isMounted = useMountedState();

    const currentFile = selectedFile.value;
    const quizzes = quizzesDb.value;

    const setFileDetails = () => {
        if (currentFile.trim() !== '') {
            const details: QuizModelResponse = [...quizzes]
                .filter((quiz: QuizModelResponse) => quiz._id.toString() === currentFile)[0];

            if (details) {
                currentFileDetailsSignal.value = details;
            } else {
                currentFileDetailsSignal.value = null;
            }
        }

        if (currentFile.trim() === '') {
            currentFileDetailsSignal.value = null;
        }
    };

    effect(() => isMounted && setFileDetails());

    return { fileDetails: currentFileDetailsSignal };
}
