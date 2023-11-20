import { JSX } from 'preact/jsx-runtime';
import { MultipleChoiceOptions } from '../../../Question/MultipleChoiceOptions';


export function AnsweredMultipleChoice({ options }: Readonly<{ options: string[] }>): JSX.Element {
    return (
        <MultipleChoiceOptions options={options} handleClick={() => { }} isHistory={true} />
    )
}
