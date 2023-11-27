import { JSX } from 'preact/jsx-runtime';
import { useEffect, useRef } from 'preact/hooks';
import { clickHandler } from '../../../../utils';
import { QuizQuestionProps } from '../QuizQuestion';
import { MultipleChoiceOptions } from '../../../Question/MultipleChoiceOptions';
import { useMountedState } from '../../../../hooks';

export type MultipleChoiceProps = {
    options: string[];
    quizState: QuizQuestionProps['quizState'];
}

export function AnswersMultipleChoice({ options, quizState }: Readonly<MultipleChoiceProps>): JSX.Element {
    const { setCurrentQuestionAnswered } = quizState;
    const isMounted: boolean = useMountedState();
    const previouslyClicked = useRef<HTMLElement | null>(null);

    const indigoHex = '#6366F1';

    const handleClick = (event: Event) => {
        const answer = event.target as HTMLElement

        const answerOption = answer?.dataset?.option ??
            answer?.parentElement?.dataset?.option ??
            answer?.parentElement?.parentElement?.dataset?.option ?? '';

        clickHandler({
            event: event as unknown as MouseEvent,
            callback: () => setCurrentQuestionAnswered(answerOption)
        })
    };

    const removeSelectedHighlight = () => {
        previouslyClicked.current?.style.removeProperty('background-color');
    };

    const addSelectedHighlight = (button: HTMLElement) => {
        button.style.setProperty('background-color', indigoHex);
    };

    useEffect(() => {
        isMounted && setTimeout(() => {
            removeSelectedHighlight();
            const buttonsToListenForClicks = document.querySelectorAll('button[data-option]');
            buttonsToListenForClicks.forEach(button => {
                button.addEventListener('click', () => {
                    removeSelectedHighlight();
                    // add the highlight to the current element
                    addSelectedHighlight(button as HTMLElement);
                    // set the current element as the previous element
                    previouslyClicked.current = button as HTMLElement;
                });
            });
        }, 50);

        !isMounted && removeSelectedHighlight();
    }, [isMounted, quizState.currentQuestionIndex]);

    return isMounted ? (
        <MultipleChoiceOptions options={options} handleClick={handleClick} />
    ) : <></>
}
