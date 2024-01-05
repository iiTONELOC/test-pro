import { Ref } from 'preact';
import { JSX } from 'preact/jsx-runtime';
import { useMountedState } from '../../hooks';
import { useState, useRef, StateUpdater } from 'preact/hooks';

const divClasses = 'w-full h-full flex flex-col justify-start items-center gap-3 items-stretch';
const buttonClasses = `bg-slate-700 rounded-md text-white p-2 `;
const selectionClasses = 'w-full h-full flex flex-row justify-start items-center gap-3 items-stretch text-base';
const highlightClasses = 'bg-indigo-700 rounded-md text-white p-2';

export interface ISelectAllThatApplyOptionsProps {
    options: string[];
    isHistory?: boolean;
    setCurrentQuestionAnswered: StateUpdater<string | null>;
}

export function SelectAllThatApplyOptions({ options, setCurrentQuestionAnswered, isHistory }: Readonly<ISelectAllThatApplyOptionsProps>): JSX.Element {
    const [showActionButtons, setShowActionButtons] = useState(false);
    const [currentAnswer, setCurrentAnswer] = useState<string | null>('');
    const [optionRefs, setOptionRefs] = useState<Ref<HTMLDivElement>[]>([]);
    const isMounted = useMountedState();

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
    };

    const handleReset = () => {
        resetState();
    };


    return isMounted ? (
        <div className={divClasses}>
            {options.map(option => {
                const optionRef = useRef<HTMLDivElement>(null);
                optionRefs.push(optionRef);
                setOptionRefs(optionRefs);
                return (
                    <div key={option} className={selectionClasses} ref={optionRef}>
                        {!isHistory ?
                            <input type="checkbox" id={option} name={option} value={option} onClick={(e: Event) => onClick(e, option)} /> :
                            <input type="checkbox" id={option} name={option} value={option} disabled />
                        }
                        <label htmlFor={option}>{option}</label>
                    </div>
                )
            })}

            {!isHistory && showActionButtons &&
                <div className={'w-full p-2 flex flex-wrap flex-row justify-between'}>
                    <button className={buttonClasses + 'hover:bg-green-700'} onClick={handleFinished}>Finished</button>
                    <button className={buttonClasses + 'hover:bg-red-600'} onClick={handleReset}>Reset</button>
                </div>
            }
        </div>
    ) : <></>;
}
