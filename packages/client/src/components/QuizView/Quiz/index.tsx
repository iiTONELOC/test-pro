import { QuizQuestion } from './QuizQuestion';
import { useMountedState } from '../../../hooks';
import { QuizDetailHeader } from '../QuizDetailHeader';
import { quizRunnerState, trimClasses } from '../../../utils';
import { useQuizViewSignal, QuizViews } from '../../../signals';


const buttonClasses = ` mt-12 mb-8 bg-gray-950 text-gray-400/[.9] text-xs md:text-sm font-semibold p-3 
rounded-md hover:cursor-pointer hover:bg-red-700 hover:text-gray-200 hover:scale-110
hover:shadow-xl transition-all min-w-max max-w-[200px] hover:border-1 hover:border-black
text-base`;

export function Quiz() { // NOSONAR
    const quizState = quizRunnerState();
    const isMounted = useMountedState();
    const { setCurrentQuizView } = useQuizViewSignal();

    const handleGoBack = () => {
        setCurrentQuizView(QuizViews.QuizDetails);
    }

    return isMounted ? quizState.quizData && (
        <section className={'flex bg-slate-900 flex-col w-full h-auto place-content-center items-center p-2 '}>
            {!quizState.currentQuestion && <QuizDetailHeader />}
            {quizState.currentQuestion &&
                <QuizQuestion quizState={quizState} question={quizState.currentQuestion} />}

            <button
                className={trimClasses(buttonClasses)}
                onClick={handleGoBack}>
                Quit
            </button>
        </section>
    ) : <></>
}
