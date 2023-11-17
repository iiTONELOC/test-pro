import { createRef } from 'preact';
import { useEffect } from 'preact/hooks';
import { useMountedState } from '../../../hooks';
import { QuizQuestionProps } from './QuizQuestion';
import { MultipleChoiceProps } from '../Quiz/Answers/MultipleChoice';
import { PopulatedQuizModel, clickHandler, trimClasses, IAnsweredQuestionData } from '../../../utils';

export type NextQuestionBtnProps = {
    quizState: QuizQuestionProps['quizState'];
}

const hasNextBtnClasses = `w-max p-3 bg-gray-700 rounded-md text-sm hover:bg-green-700 ease-in-out duration-300`;

const hasNextQuestion = (currentQuestionIndex: number | null, quizData: PopulatedQuizModel | null) => {
    const nextIndex = currentQuestionIndex ? currentQuestionIndex + 1 : 1;
    const isOverFlow = nextIndex > (quizData?.questions?.length ?? 0);

    return !isOverFlow;
};

const handleAddAnswer = (answer: string, quizState: MultipleChoiceProps['quizState']) => {
    // the elapsed time currently has the starting time of the question
    // so we need to subtract the current time from the elapsed time
    const current = Date.now();
    const elapsedTime = current - (quizState.elapsedQuestionTime ?? 0);

    // create an answered question object
    const answeredQuestion: IAnsweredQuestionData = {
        answeredQuestion: {
            question: quizState.currentQuestion?._id.toString() ?? '',
            selectedAnswer: answer,
            elapsedTimeInMs: elapsedTime,
        }
    };

    quizState.addAnsweredQuestionToAttempt(answeredQuestion);
};


export function NextQuestionBtn({ quizState }: Readonly<NextQuestionBtnProps>): JSX.Element { // NOSONAR
    const { currentQuestionIndex, quizData, currentQuestionAnswered } = quizState;
    const hasNext = hasNextQuestion(currentQuestionIndex, quizData);
    const isMounted = useMountedState();

    const divRef = createRef<HTMLDivElement>();

    const handleClick = (event: Event) => {
        clickHandler({
            event: event as unknown as MouseEvent,
            callback: () => currentQuestionAnswered && handleAddAnswer(currentQuestionAnswered, quizState),
            stopPropagation: true
        });
    };

    useEffect(() => {
        if (isMounted && currentQuestionAnswered) {
            divRef.current?.classList.remove('invisible');
        }
        if (isMounted && !currentQuestionAnswered) {
            divRef.current?.classList.add('invisible');
        }
    }, [currentQuestionAnswered]);

    return isMounted ? (
        <div ref={divRef} className={'flex flex-wrap flex-row justify-end mt-2 my-4 mr-4 h-16 invisible'}>
            {hasNext && currentQuestionAnswered &&
                <button className={trimClasses(hasNextBtnClasses)} onClick={handleClick}>
                    Next Question
                </button>
            }
        </div>
    ) : <></>
}
