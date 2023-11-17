
import { QuizQuestion } from './QuizQuestion';
import { quizRunnerState } from '../../../utils';
import { useMountedState } from '../../../hooks';
import DetailHeader from '../QuizDetails/DetailHeader';

export function Quiz() { // NOSONAR
    const quizState = quizRunnerState();
    const isMounted = useMountedState();

    return isMounted ? quizState.quizData && (
        <section className={'flex flex-col w-full h-[calc(100vh-83px)] place-content-center items-center p-2 overflow--auto'}>
            {!quizState.currentQuestion && <DetailHeader />}
            {quizState.currentQuestion &&
                <QuizQuestion quizState={quizState} question={quizState.currentQuestion} />}
        </section>
    ) : <></>
}
