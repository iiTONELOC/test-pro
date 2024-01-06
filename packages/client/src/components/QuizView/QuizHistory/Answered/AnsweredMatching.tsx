import { uuid } from '../../../../utils';
import { JSX } from 'preact/jsx-runtime';
import { useMountedState } from '../../../../hooks';
import { MutableRef, useEffect, useState } from 'preact/hooks';
import { PopulatedQuizQuestionResultType } from '../../../../utils/api'

const buttonClasses = `bg-slate-700 rounded-md  p-2 `;
const divClasses = 'w-full h-full flex flex-row justify-start items-between gap-3 items-stretch';
const selectionClasses = 'w-[40%] h-full flex flex-col justify-start items-center gap-3 items-stretch';

export const handleShowCorrectAnswer = (questionRef: MutableRef<HTMLLIElement | null>, questionResult: PopulatedQuizQuestionResultType) => {
    const usersAnswers = buildSelectedAnswer(questionResult);
    const correctAnswerKey = buildSelectedAnswer(questionResult, true);

    for (const [option, matchingOption] of Object.entries(usersAnswers)) {
        if (matchingOption !== correctAnswerKey[option]) {
            const answerElement = questionRef.current?.querySelector(`[data-id="${option}-${matchingOption}"]`);
            answerElement?.classList.remove('bg-red-700');
            answerElement?.classList.add('bg-purple-700');
            answerElement?.textContent && (answerElement.textContent = correctAnswerKey[option] ?? '');
        }
    }
};

export const removeShowCorrectAnswer = (questionRef: MutableRef<HTMLLIElement | null>, questionResult: PopulatedQuizQuestionResultType) => {
    const usersAnswers = buildSelectedAnswer(questionResult);
    const correctAnswerKey = buildSelectedAnswer(questionResult, true);

    for (const [option, matchingOption] of Object.entries(usersAnswers)) {
        if (matchingOption !== correctAnswerKey[option]) {
            const answerElement = questionRef.current?.querySelector(`[data-id="${option}-${matchingOption}"]`);
            answerElement?.classList.remove('bg-purple-700');
            answerElement?.classList.add('bg-red-700');
            answerElement?.textContent && (answerElement.textContent = matchingOption);
        }
    }
};



const buildSelectedAnswer = (questionResult: PopulatedQuizQuestionResultType, useAnswerKey = false): { [key: string]: string | null } => {

    const selectedAnswer = (!useAnswerKey ? questionResult.selectedAnswer.split(',')
        : questionResult.question.answer.split(',')).map(answer => answer.trim())
        .filter(answer => answer !== '' && answer !== undefined);
    const optionsToAnswer: { [key: string]: string | null } = {};

    for (const answer of selectedAnswer) {
        const [option, matchingOption] = answer.split('-')
            .map(answer => answer.trim())
            .filter(answer => answer !== '')
            .filter(el => el !== undefined);
        optionsToAnswer[option] = matchingOption;
    }

    return optionsToAnswer;
}

export function AnsweredMatching({ questionResult }: { questionResult: PopulatedQuizQuestionResultType }): JSX.Element {
    const isMounted: boolean = useMountedState();
    const options = questionResult.question.options;
    const matchingOptions = questionResult.question.matchOptions ?? [];
    const [optionsToAnswer, setOptionsToAnswer] = useState<{ [key: string]: string | null }>({});

    useEffect(() => {
        setOptionsToAnswer(buildSelectedAnswer(questionResult));
    }, []);


    return isMounted ? (
        <div className={divClasses}>
            <div className={selectionClasses + ' bg-gray-900 p-2'}>
                {options.map(option => {
                    const answerId = `${option}-${optionsToAnswer[option]}`;
                    const answerKey = questionResult.question.answer
                        .split(',')
                        .map(answer => answer.trim())
                        .filter(answer => answer !== '');
                    const isAnsweredQuestionCorrect = answerKey.includes(answerId ?? '');
                    const bgClasses = (isAnsweredQuestionCorrect ? 'bg-green-700' : 'bg-red-700') + ' text-white rounded-sm p-1';

                    return (
                        <div className={buttonClasses} key={option} data-id={option}>
                            <span className={'w-full h-auto flex flex-col gap-3 justify-start items-center items-stretch'}>
                                {option}

                                <hr className={'bg-gray-200'} />

                                <span data-id={`${option}-${optionsToAnswer[option]}`}
                                    className={bgClasses}>
                                    {optionsToAnswer[option]}
                                </span>
                            </span>
                        </div>
                    )
                })}
            </div>

            <div className={'w-[75%] flex flex-wrap flex-row justify-end items-center'}>
                <div className={'w-1/2 h-full flex flex-col justify-start items-center gap-3 items-stretch bg-gray-700 p-2 rounded-sm'}>
                    {/* create divs for each option */}
                    {matchingOptions.map((option) => {
                        return (
                            <div className={buttonClasses + ' bg-slate-800'} key={uuid()} data-id={option}>
                                {option}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    ) : <></>
}
