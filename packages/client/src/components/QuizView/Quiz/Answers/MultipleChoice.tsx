import { useEffect } from 'preact/hooks';
import { QuizQuestionProps } from '../QuizQuestion';
import { clickHandler, trimClasses, uuid } from '../../../../utils';


const optionIndex = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const divClasses = 'w-full h-full flex grid p-2 gap-3 text-shadow grid-cols-1 md:grid-cols-2';

const buttonClasses = `bg-slate-700 rounded-md hover:bg-slate-600 text-white w-auto min-w-[250px]
h-max flex flex-row flex-wrap items-center justify-between`;

const modIndex = (index: number) => {
    if (index >= optionIndex.length) {
        return index - optionIndex.length;
    }
    return index;
};


export type MultipleChoiceProps = {
    options: string[];
    quizState: QuizQuestionProps['quizState'];
}

export function MultipleChoice({ options, quizState }: Readonly<MultipleChoiceProps>): JSX.Element {
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
        <div className={divClasses}>
            {options.map((option, index) => (
                <button
                    key={uuid()}
                    data-option={option}
                    onClick={handleClick}
                    className={trimClasses(buttonClasses)}>
                    <span className={'w-full h-full flex flex-row flex-wrap gap-3 justify-start items-center rounded-md'}>
                        <p className={'w-[12%] p-3 rounded-md h-full bg-slate-800 flex justify-center items-center -ml-1'}>
                            {optionIndex[modIndex(index)]}.
                        </p>
                        <p className={'flex flex-wrap flex-row'}>
                            {option}
                        </p>
                    </span>
                </button>
            ))}
        </div>
    )
}
