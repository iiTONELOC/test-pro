import { Ref } from 'preact';
import { JSX, } from 'preact/jsx-runtime';
import { useState, useRef } from 'preact/hooks';
import { QuizQuestionProps } from '../QuizQuestion';
import { useMountedState } from '../../../../hooks';


const buttonClasses = `bg-slate-700 rounded-md text-white p-2 `;
const highlightClasses = 'bg-slate-800 rounded-md text-white p-2 ring-2 ring-amber-600';
const divClasses = 'w-full h-full flex flex-col justify-start items-center gap-3 items-stretch';
const selectionClasses = 'w-full h-full flex flex-row justify-start items-center gap-3 items-stretch text-base';


export type SelectAllThatApplyProps = {
    options: string[];
    quizState: QuizQuestionProps['quizState'];
}

export function AnswersSelectAllThatApply({ options, quizState }: Readonly<SelectAllThatApplyProps>): JSX.Element {
    const { setCurrentQuestionAnswered } = quizState;

    const isMounted = useMountedState();
    const [showActionButtons, setShowActionButtons] = useState(false);
    const [currentAnswer, setCurrentAnswer] = useState<string | null>('');
    const [optionRefs, setOptionRefs] = useState<Ref<HTMLDivElement>[]>([]);

    const resetState = () => {
        setShowActionButtons(false);
        setCurrentAnswer('');
        setOptionRefs([]);
    }

    const hideActionButtons = () => {
        // check the number of checked options, if none, hide action buttons
        // @ts-ignore
        const checkedOptions = optionRefs.filter(option => option?.current?.querySelector('input')?.checked);
        if (checkedOptions.length === 0) {
            setShowActionButtons(false);
        }
    }

    const onClick = (event: Event, answer: string) => {
        setShowActionButtons(true);
        hideActionButtons();

        // if we are checking the box, add the answer to the current answer state with a comma
        // if we are unchecking the box, remove the answer from the current answer state
        const isChecked = (event.target as HTMLInputElement).checked;

        if (isChecked) {
            setCurrentAnswer(currentAnswer + answer + ',');
            // add all the highlight classes to the current element
            highlightClasses.split(' ').forEach(highlightClass => {
                // @ts-ignore
                event.target.parentElement.classList.add(highlightClass);
                //@ts-ignore
            });
        } else {
            setCurrentAnswer(currentAnswer?.replace(answer + ',', '') ?? '');
            // remove the highlight from the current element
            highlightClasses.split(' ').forEach(highlightClass => {
                // @ts-ignore
                event.target.parentElement.classList.remove(highlightClass);
            });
        }
    };

    const handleFinished = () => {
        setCurrentQuestionAnswered(currentAnswer);
        resetState();
        // don't remove anything or hide the buttons, this allows the user to still make changes until
        // they click the next question button (Not located on this component)
    };

    const handleReset = () => {
        resetState();
        //de-select all the checkboxes that are checked
        // @ts-ignore
        optionRefs.forEach(option => option.current.querySelector('input').checked = false);
        // remove all the highlight classes from all the options
        highlightClasses.split(' ').forEach(highlightClass => {
            // @ts-ignore
            optionRefs.forEach(option => option.current.classList.remove(highlightClass));
        });
    };


    return isMounted ? (
        <div className={divClasses}>
            {options.map(option => {
                const optionRef = useRef<HTMLDivElement>(null);
                optionRefs.push(optionRef);
                setOptionRefs(optionRefs);
                return (
                    <div key={option} className={selectionClasses} ref={optionRef}>
                        <input type="checkbox" className='self-center rounded-md ml-[3px] text-center' id={option} name={option} value={option} onClick={(e: Event) => onClick(e, option)} />
                        <label htmlFor={option}>{option}</label>
                    </div>
                )
            })}

            {showActionButtons &&
                <div className={'w-full p-2 flex flex-wrap flex-row justify-between'}>
                    <button className={buttonClasses + 'hover:bg-green-700'} onClick={handleFinished}>Finished</button>
                    <button className={buttonClasses + 'hover:bg-red-600'} onClick={handleReset}>Reset</button>
                </div>
            }
        </div>
    ) : <></>;
}
