import { JSX } from 'preact/jsx-runtime';
import { uuid } from '../../../../utils';
import { useEffect, useState } from 'preact/hooks';
import { QuizQuestionProps } from '../QuizQuestion';
import { useMountedState } from '../../../../hooks';
import { DraggableItem, DroppableArea } from '../../../DragAndDrop';

const buttonClasses = `bg-slate-700 rounded-md  p-2 `;
const divClasses = 'w-full h-full flex flex-row justify-start items-between gap-3 items-stretch';
const selectionClasses = 'w-[35%] h-full flex flex-col justify-start items-center gap-3 items-stretch';

export type Matching = {
    options: string[];
    matchingOptions: string[];
    quizState: QuizQuestionProps['quizState'];
    reUsableOptions?: boolean;
}

export function AnswersMatching({ options, matchingOptions, quizState, reUsableOptions }: Readonly<Matching>): JSX.Element {
    const isMounted: boolean = useMountedState();
    const { setCurrentQuestionAnswered } = quizState;
    const [answers, setAnswers] = useState<string>('');
    const [showActionButtons, setShowActionButtons] = useState(false);
    const [optionsToAnswer, setOptionsToAnswer] = useState<{ [key: string]: string | null }>({});
    const [matchingOptionsAvailable, setMatchingOptionsAvailable] = useState<string[]>(matchingOptions);

    // Options are draggable, but the items they need to be matched to are not
    // On drop we need to handle the drop event depending on the dragged item and the target item
    const handleDrop = (draggedItemId: string, targetItemId: string) => {
        // Check to see if the targetItem is the non-draggable item that is awaiting its match
        // @ts-ignore
        if ((targetItemId !== 'options' || targetItemId !== 'matching') &&
            draggedItemId !== targetItemId && Object.keys(optionsToAnswer).includes(targetItemId)) {

            // look for the optionRefs with the targetItemId
            const targetSpanRef = document.querySelector(`span[data-id="${targetItemId}"]`) as HTMLSpanElement;

            // creates the next portion of the answer string
            // when grading a quiz the answer expects the string to be in a specific format
            // in the case of a Matching question, the answer string should be in the format of
            // option-usersAnswer,option-usersAnswer, etc...
            const answerToSet = targetItemId + '-' + draggedItemId + ',';

            // Update the optionsToAnswer state
            if (targetSpanRef && !draggedItemId.includes('-')) {
                const opts = optionsToAnswer;
                const currentOption = opts[targetItemId];
                if (currentOption !== null && currentOption !== '') {
                    // remove the current option from the answers state
                    setAnswers(answers.replace(answerToSet, ''));
                } else {
                    // add the answer to the answers state
                    setAnswers(answers + answerToSet);
                }
                // update the optionsToAnswer state
                opts[targetItemId] = draggedItemId;
                setOptionsToAnswer({ ...opts });

                // if the option is not reusable, we need to remove it from the options shown to the user
                !reUsableOptions &&
                    matchingOptionsAvailable.includes(draggedItemId)
                    && setMatchingOptionsAvailable(matchingOptionsAvailable.filter(option => option !== draggedItemId))
            }
            // Its not an option awaiting its match
            // Look for an option that has been placed on a match and is now being dragged back to its original container
        } else if ((targetItemId === 'matching' || targetItemId === 'MatchingRoot') && draggedItemId.includes('-')) {
            // get the option and answer from the draggedItemId
            const [targetOption, answer] = draggedItemId.split('-').map(item => item.trim());

            // remove the answer from the answers state
            setAnswers(answers.replace(`${draggedItemId},`, ''));

            // remove the answer from the optionsToAnswer state
            const opts = optionsToAnswer;
            opts[targetOption] = '';
            setOptionsToAnswer(opts);

            // if the option is not reusable, we need to add it back to the options
            !reUsableOptions &&
                !matchingOptionsAvailable.includes(answer)
                && setMatchingOptionsAvailable([...matchingOptionsAvailable, answer])

            // not a drop event we care about
        } else {
            // Do nothing
        }

        // check the optionsToAnswer state to see if any options are answered, if they are all null or '', hide the action buttons
        // @ts-ignore
        const answeredOptions = Object.values(optionsToAnswer).filter(option => option !== '' && option !== null);
        setShowActionButtons(answeredOptions.length > 0);
    };

    // Build the optionsToAnswer state object
    // we need to keep track of the options that have been answered and the value of the answer
    // this is used to display that value to the user
    const buildOptionsToAnswer = () => {
        const temp: { [key: string]: string | null } = {}
        options.forEach(option => {
            temp[option] = '';
        });
        setOptionsToAnswer({ ...temp });
    };

    const resetState = () => {
        setShowActionButtons(false);
        buildOptionsToAnswer();
        setMatchingOptionsAvailable(matchingOptions);
        setAnswers('');
    };

    const handleFinished = () => {
        setCurrentQuestionAnswered(answers);
    };

    const handleReset = () => {
        resetState();
    };

    useEffect(() => {
        isMounted && resetState();
    }, [isMounted, options, matchingOptions]);



    return isMounted ? (
        <>
            <div className={divClasses}>
                <DroppableArea onDrop={handleDrop} id='MatchingRoot' className={divClasses}>
                    <div className={selectionClasses + ' bg-gray-900 p-2'}>
                        {options.map((option) => {
                            return (
                                <DroppableArea onDrop={handleDrop} key={option} id={option}
                                    className=''>
                                    <div className={buttonClasses}>
                                        <span data-id={option} className={'w-full h-auto flex flex-col gap-3 justify-start items-center items-stretch'}>
                                            {option}
                                            {optionsToAnswer[option]
                                                && optionsToAnswer[option] !== ''
                                                && optionsToAnswer[option] !== undefined &&
                                                <>
                                                    <hr className={'bg-gray-200'} />

                                                    <DraggableItem id={`${option}-${optionsToAnswer[option]}`}>
                                                        <span className={'bg-slate-950 p-2 rounded-sm'}>
                                                            {optionsToAnswer[option]}
                                                        </span>
                                                    </DraggableItem>
                                                </>
                                            }
                                        </span>
                                    </div>
                                </DroppableArea>
                            )
                        })}
                    </div>

                    <div className={'w-[75%] flex flex-wrap flex-row justify-end items-center'}>
                        <div className={'w-[45%] h-full flex flex-col justify-start items-center gap-3 items-stretch bg-gray-700 p-2 rounded-sm'}>
                            <DroppableArea onDrop={handleDrop} id='matching'
                                className='h-full flex flex-col justify-start items-center gap-3 items-stretch'>
                                {/* create divs for each option */}
                                {matchingOptionsAvailable.map((option) => {
                                    return (
                                        <DraggableItem id={option} key={uuid()}>
                                            <div className={buttonClasses + ' bg-slate-800'}>
                                                {option}
                                            </div>
                                        </DraggableItem>
                                    )
                                })}
                            </DroppableArea>
                        </div>
                    </div>
                </DroppableArea>
            </div>

            {showActionButtons &&
                <div className={'w-full p-2 flex flex-wrap flex-row justify-between'}>
                    <button className={buttonClasses + 'hover:bg-green-700'} onClick={handleFinished}>Finished</button>
                    <button className={buttonClasses + 'hover:bg-red-600'} onClick={handleReset}>Reset</button>
                </div>}
        </>
    ) : <></>
}
