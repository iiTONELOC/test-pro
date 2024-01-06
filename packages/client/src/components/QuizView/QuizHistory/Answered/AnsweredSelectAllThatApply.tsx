import { JSX, } from 'preact/jsx-runtime';
import { MutableRef } from 'preact/hooks';
import { useMountedState } from '../../../../hooks';
import { PopulatedQuizQuestionResultType } from '../../../../utils/api';



const selectedCorrectHighLight = 'bg-gray-700 ring-2 ring-green-600 text-gray-100 rounded-md flex flex-row justify-start items-center gap-3 items-stretch';
const selectedIncorrectHighLight = 'bg-red-700 rounded-md flex flex-row justify-start items-center gap-3 items-stretch';
const divClasses = 'w-full h-full flex flex-col justify-start items-center gap-3 items-stretch';
const selectionClasses = 'w-full h-full flex flex-row justify-start items-center gap-3 items-stretch';
const slate950 = '#020617';

export type SelectAllThatApplyProps = {
    options: string[];
}


export const handleShowCorrectAnswer = (questionRef: MutableRef<HTMLLIElement | null>, correctAnswer: string) => {
    const idsToLookFor = correctAnswer.split(',').map(answer => answer.trim()).filter(answer => answer !== '');

    for (const id of idsToLookFor) {
        const answerElement = questionRef.current?.querySelector(`[data-id="${id}"]`);
        // add the correct highlight class to the selected answer
        selectedCorrectHighLight.split(' ').forEach(highlightClass => {
            answerElement?.classList.add(highlightClass);
        });
    }
};

export const removeShowCorrectAnswer = (questionRef: MutableRef<HTMLLIElement | null>, correctAnswer: string) => {
    const idsToLookFor = correctAnswer.split(',').map(answer => answer.trim()).filter(answer => answer !== '');

    for (const id of idsToLookFor) {
        const answerElement = questionRef.current?.querySelector(`[data-id="${id}"]`);
        // add the correct highlight class to the selected answer
        'bg-gray-700 ring-2 ring-green-600 text-gray-100 rounded-md'.split(' ').forEach(highlightClass => {
            answerElement?.classList.remove(highlightClass);
        });
    }
};

export const checkSelection = (questionRef: MutableRef<HTMLLIElement | null>, selectedAnswer: string, questionResult: PopulatedQuizQuestionResultType['question']) => {
    const realAnswerKey = questionResult.answer.split(',').map(answer => answer.trim()).filter(answer => answer !== '');
    const selectedAnswerKey = selectedAnswer.split(',').map(answer => answer.trim()).filter(answer => answer !== '');

    for (const answer of selectedAnswerKey) {
        const answerElement = questionRef.current?.querySelector(`[data-id="${answer}"]`);

        // add the correct highlight class to the selected answer
        if (realAnswerKey.includes(answer)) {
            selectedCorrectHighLight.split(' ').forEach(highlightClass => {
                answerElement?.classList.add(highlightClass);
            });
        } else {
            selectedIncorrectHighLight.split(' ').forEach(highlightClass => {
                answerElement?.classList.add(highlightClass);
            });
        }

        // find the input element and check it
        const inputElement = answerElement?.querySelector('input');

        inputElement?.setAttribute('checked', 'true');
        // set the background color of the checkbox to be gray
        inputElement?.setAttribute('style', `background-color: ${slate950};`);
    }
}

export function AnsweredSelectAllThatApply({ options }: Readonly<SelectAllThatApplyProps>): JSX.Element {

    const isMounted = useMountedState();
    return isMounted ? (
        <div className={divClasses}>
            {options.map(option => {
                return (
                    <div key={option} className={selectionClasses} data-id={option}>
                        <input className='self-center rounded-md ml-[3px] text-center' type="checkbox" id={option} name={option} value={option} disabled={true} />
                        <label htmlFor={option}>{option}</label>
                    </div>
                )
            })}
        </div>
    ) : <></>;
}
