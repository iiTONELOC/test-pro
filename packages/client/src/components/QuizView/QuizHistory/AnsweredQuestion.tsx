import { JSX } from 'preact/jsx-runtime';
import { ReactNode } from 'preact/compat';
import { useMountedState } from '../../../hooks';
import { useEffect, useRef, useState } from 'preact/hooks';
import { AnswerOptions } from '../../Question/AnswerOptions';
import { PopulatedQuizQuestionResultType } from '../../../utils/api';
import { QuestionCardBody, QuestionCard, QuestionCardHeader } from '../../Question/Card';
import { TopicModelType, clickHandler, displayElapsedTime, titleCase, uuid } from '../../../utils';

function StatKey({ label }: Readonly<{ label: string }>) {
    return (
        <span className={'bg-slate-800 py-2 px-3 rounded-sm rounded-l-md h-full flex items-center'}>
            <p>{label}</p>
        </span>
    )
}

function StatLine({ children }: Readonly<{ children: ReactNode | ReactNode[] }>) {
    return (
        <span className={'w-auto h-auto rounded-md flex flex-row justify-start items-center gap-3 bg-slate-700'}>
            {children}
        </span>
    )
}


export function AnsweredQuizQuestion({ questionResult }: Readonly<{ questionResult: PopulatedQuizQuestionResultType }>): JSX.Element {// NOSONAR
    const [showCorrectAnswer, setShowCorrectAnswer] = useState<boolean>(false);

    const isMounted = useMountedState();
    const questionRef = useRef<HTMLDivElement>(null);

    // @ts-ignore
    const topics = questionResult.question.topics.map((topic: TopicModelType) => topic.name);
    const correctAnswer = questionResult.question.answer;
    const selectedAnswer = questionResult.selectedAnswer;

    const handleShowCorrectAnswer = () => {
        const correctAnswerElement = questionRef.current?.querySelector(`[data-option="${correctAnswer}"]`);
        correctAnswerElement?.classList.add('ring-2');
        correctAnswerElement?.classList.add('ring-green-600');
        correctAnswerElement?.classList.add('bg-green-800');
    };

    const removeShowCorrectAnswer = () => {
        const correctAnswerElement = questionRef.current?.querySelector(`[data-option="${correctAnswer}"]`);
        correctAnswerElement?.classList.remove('ring-2');
        correctAnswerElement?.classList.remove('ring-green-600');
        correctAnswerElement?.classList.remove('bg-green-800');
    };

    const handleSetShowCorrectAnswer = () => setShowCorrectAnswer(!showCorrectAnswer);

    const handleClick = (event: MouseEvent) => clickHandler({
        event,
        callback: handleSetShowCorrectAnswer,
        stopPropagation: true
    });

    const checkSelection = () => {
        const selectedAnswerElement = questionRef.current?.querySelector(`[data-option="${selectedAnswer}"]`);
        selectedAnswerElement?.classList.add('ring-2');

        if (questionResult.isCorrect) {
            selectedAnswerElement?.classList.add('ring-green-600');
        } else {
            selectedAnswerElement?.classList.add('ring-red-700');
        }
    }

    useEffect(() => {
        if (isMounted) {
            setTimeout(() => checkSelection(), 75);
        }
    }, [isMounted, questionResult]);

    useEffect(() => {
        if (isMounted) {
            if (showCorrectAnswer) {
                handleShowCorrectAnswer();
                // reset the state after 5 seconds
                setTimeout(() => {
                    setShowCorrectAnswer(false);
                }, 5000);
            } else {
                // ensure the correct answer is not shown
                removeShowCorrectAnswer();
                // ensure the selected answer is shown
                checkSelection();
            }
        }
    }, [showCorrectAnswer, isMounted]);

    const correctClass = questionResult.isCorrect ? 'bg-green-700' : 'bg-red-700';


    return isMounted ? (
        <div className={'w-full h-auto flex justify-center ease-in-out duration-300 transition-all'} ref={questionRef}>
            <QuestionCard>
                <span className={'w-full flex flex-wrap flex-row justify-between '}>
                    <QuestionCardHeader topics={topics} />
                    <span className={` py-2 px-3 ${correctClass} rounded-md`}>
                        {questionResult.isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                </span>

                <QuestionCardBody question={questionResult.question.question ?? ''} />
                <AnswerOptions isHistory={true} question={questionResult.question ?? ''} />

                <div className={'w-auto h-auto flex flex-col gap-3 bg-slate-950 p-2 rounded-md'}>
                    <StatLine>
                        <StatKey label='Time to Answer:' />
                        <p>{displayElapsedTime(questionResult.elapsedTimeInMs)}</p>
                    </StatLine>

                    <StatLine>
                        <StatKey label={'Points Received:'} />
                        <p>{questionResult.isCorrect ? 1 : 0} </p>
                    </StatLine>
                    {!questionResult.isCorrect && (
                        <StatLine>
                            <StatKey label={'Areas to Review:'} />
                            {questionResult.question.areaToReview.map((area: string, index: number) => {
                                const isLast = index === questionResult.question.areaToReview.length - 1;
                                return (
                                    <p key={uuid()}>{titleCase(area)}{!isLast && ','}</p>
                                )
                            })}
                        </StatLine>
                    )}
                    {(questionResult.isCorrect || showCorrectAnswer) && (
                        <StatLine>
                            <StatKey label={'Answer Explanation:'} />
                            <p>{questionResult.question.explanation}</p>
                        </StatLine>
                    )}
                </div>

                {
                    !questionResult.isCorrect &&
                    <span className={'flex flex-row justify-end'}>
                        <button className={`bg-slate-700 rounded-md p-2 hover:bg-green-700`} onClick={handleClick}>
                            {showCorrectAnswer ? 'Hide Correct Answer' : 'Reveal Answer for 5 Seconds'}
                        </button>
                    </span>
                }
            </QuestionCard>
        </div >

    ) : <></>
}
