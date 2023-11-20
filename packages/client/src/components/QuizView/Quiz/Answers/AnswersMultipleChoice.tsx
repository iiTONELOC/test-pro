import { JSX } from 'preact/jsx-runtime';
import { useEffect } from 'preact/hooks';
import { clickHandler } from '../../../../utils';
import { QuizQuestionProps } from '../QuizQuestion';
import { MultipleChoiceOptions } from '../../../Question/MultipleChoiceOptions';

export type MultipleChoiceProps = {
    options: string[];
    quizState: QuizQuestionProps['quizState'];
}

export function AnswersMultipleChoice({ options, quizState }: Readonly<MultipleChoiceProps>): JSX.Element {
    const { setCurrentQuestionAnswered, currentQuestionAnswered } = quizState;

    const handleClick = (event: Event) => {
        const answer = event.target as HTMLElement

        const answerOption = answer?.dataset?.option ??
            answer?.parentElement?.dataset?.option ??
            answer?.parentElement?.parentElement?.dataset?.option ?? '';

        clickHandler({
            event: event as unknown as MouseEvent,
            callback: () => {
                setCurrentQuestionAnswered(answerOption);
            }
        })
    };

    const hightLightSelectedAnswer = () => {
        const indigo = `#4F46E5`;
        const darkIndigo = `#4338CA`;
        const selectedAnswer: HTMLElement | null = document.querySelector(`[data-option="${currentQuestionAnswered}"]`);
        // tailwinds is not registering the color change here so we will do it manually - not sure if the classes are
        // not being added or if the color is being over ridden by something else. I can see the class names in the DOM
        // but the styles are not being applied.
        if (selectedAnswer) {
            // over ride the background color  of the selected answer
            selectedAnswer.style.backgroundColor = indigo;
            selectedAnswer.addEventListener('mouseover', () => {
                selectedAnswer.style.backgroundColor = darkIndigo;
            });

            selectedAnswer.addEventListener('mouseout', () => {
                selectedAnswer.style.backgroundColor = indigo;
            });
        }
    };

    useEffect(() => {
        currentQuestionAnswered && hightLightSelectedAnswer();
    }, [currentQuestionAnswered]);

    return (
        <MultipleChoiceOptions options={options} handleClick={handleClick} />
    )
}
