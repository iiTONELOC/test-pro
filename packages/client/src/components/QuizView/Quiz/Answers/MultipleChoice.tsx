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
        const selectedAnswer = document.querySelector(`[data-option="${currentQuestionAnswered}"]`);
        selectedAnswer?.classList?.add('bg-indigo-700');
        selectedAnswer?.classList?.add('hover:bg-indigo-600');
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
