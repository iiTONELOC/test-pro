import { JSX } from 'preact/jsx-runtime';
import { trimClasses } from '../../utils';

const optionIndex = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const optionClasses = ' flex flex-row justify-start items-center text-left w-[88%] h-full'
const spanClasses = 'w-full h-full flex flex-row gap-3 justify-start items-center rounded-md';
const optIndexClasses = 'w-[12%] p-3 rounded-md h-full bg-slate-800 flex justify-center items-center -ml-1';
const divClasses = 'w-full h-full flex grid p-2 gap-3 text-shadow grid-cols-1 md:grid-cols-2';

const modIndex = (index = 0) => index >= optionIndex.length ? index - optionIndex.length : index;

export interface IMultipleChoiceOptionsProps {
    options: string[];
    isHistory?: boolean;
    handleClick?: (event: Event) => void;
}

export function MultipleChoiceOptions({ options, handleClick, isHistory = false }: Readonly<IMultipleChoiceOptionsProps>): JSX.Element {
    const buttonClasses = `bg-slate-700 rounded-md ${!isHistory ? 'hover:bg-slate-600' : 'hover:cursor-default'} text-white w-auto min-w-[250px]
    h-max flex flex-row flex-wrap items-center justify-between`;

    const handleOnClick = handleClick ?? undefined ? handleClick : () => { };

    return (
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
    )
}
