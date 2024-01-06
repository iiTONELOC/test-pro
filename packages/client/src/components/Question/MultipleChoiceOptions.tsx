import { JSX } from 'preact/jsx-runtime';
import { trimClasses } from '../../utils';
import { MutableRef } from 'preact/hooks';
import { useMountedState } from '../../hooks';


const optionIndex = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const optionClasses = ' flex flex-row justify-start items-center text-left w-[88%] h-full p-1'
const spanClasses = 'w-full h-full flex flex-row gap-3 justify-start items-center rounded-md';
const optIndexClasses = 'w-[12%] p-3 rounded-md h-full bg-slate-800 flex justify-center items-center -ml-1';
const divClasses = 'w-full h-full flex flex-wrap flex row justify-center items-center gap-3 items-stretch';

const modIndex = (index = 0) => index >= optionIndex.length ? index - optionIndex.length : index;

export interface IMultipleChoiceOptionsProps {
    options: string[];
    isHistory?: boolean;
    handleClick?: (event: Event) => void;
}

/**
 * Highlights the correct answer for the question - To be used in quiz history
 * @param questionRef - the answered question reference
 * @param correctAnswer - the correct answer for the question , or the data-option value to be highlighted
 * @returns void
 */
export const handleShowCorrectAnswer = (questionRef: MutableRef<HTMLLIElement | null>, correctAnswer: string) => {
    const correctAnswerElement = questionRef?.current?.querySelector(`[data-option="${correctAnswer}"]`);
    correctAnswerElement?.classList.add('ring-2');
    correctAnswerElement?.classList.add('ring-green-600');
    correctAnswerElement?.classList.add('bg-green-800');
};

/**
 * Removes the highlight from the correct answer for the question - To be used in quiz history
 * @param questionRef - the answered question reference
 * @param correctAnswer - the correct answer for the question , or the data-option value to be highlighted
 * @returns void
 */
export const removeShowCorrectAnswer = (questionRef: MutableRef<HTMLLIElement | null>, correctAnswer: string) => {
    const correctAnswerElement = questionRef.current?.querySelector(`[data-option="${correctAnswer}"]`);
    correctAnswerElement?.classList.remove('ring-2');
    correctAnswerElement?.classList.remove('ring-green-600');
    correctAnswerElement?.classList.remove('bg-green-800');
};

/**
 * Checks the selected answer and highlights it accordingly - To be used in quiz history
 * @param questionRef - the answered question reference
 * @param selectedAnswer  - the selected answer for the question , or the data-option value to be highlighted
 * @param isCorrect  - whether the selected answer is correct or not
 */
export const checkSelection = (questionRef: MutableRef<HTMLLIElement | null>, selectedAnswer: string, isCorrect: boolean) => {
    const selectedAnswerElement = questionRef.current?.querySelector(`[data-option="${selectedAnswer}"]`);
    selectedAnswerElement?.classList.add('ring-2');

    if (isCorrect) {
        selectedAnswerElement?.classList.add('ring-green-600');
    } else {
        selectedAnswerElement?.classList.add('ring-red-700');
    }
};

export function MultipleChoiceOptions({ options, handleClick, isHistory = false }: Readonly<IMultipleChoiceOptionsProps>): JSX.Element {
    const buttonClasses = `bg-slate-700 rounded-md ${!isHistory ? 'hover:bg-slate-600' : 'hover:cursor-default'} text-white
    w-full sm:w-5/3 md:w-2/3 lg:w-1/2 h-max flex flex-row flex-wrap items-center justify-between`;

    const isMounted = useMountedState();
    const handleOnClick = handleClick ?? undefined ? handleClick : () => { };

    return isMounted ? (
        <div className={divClasses}>
            {options.map((option, index) => (
                <button
                    key={option}
                    data-option={option}
                    onClick={handleOnClick}
                    className={trimClasses(buttonClasses)}>
                    <span className={spanClasses}>
                        <p className={optIndexClasses}>
                            {optionIndex[modIndex(index)]}.
                        </p>
                        <p className={optionClasses}>
                            {option}
                        </p>
                    </span>
                </button>
            ))}
        </div>
    ) : <></>;
}
