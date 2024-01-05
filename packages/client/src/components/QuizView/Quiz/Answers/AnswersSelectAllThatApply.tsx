import { JSX } from 'preact/jsx-runtime';
import { QuizQuestionProps } from '../QuizQuestion';
import { useMountedState } from '../../../../hooks';
import { SelectAllThatApplyOptions } from '../../../Question/SelectAllThatApplyOptions';


export type SelectAllThatApplyProps = {
    options: string[];
    quizState: QuizQuestionProps['quizState'];
}

export function AnswersSelectAllThatApply({ options, quizState }: Readonly<SelectAllThatApplyProps>): JSX.Element {
    const { setCurrentQuestionAnswered } = quizState;
    const isMounted: boolean = useMountedState();

    return isMounted ? (
        <SelectAllThatApplyOptions options={options} setCurrentQuestionAnswered={setCurrentQuestionAnswered} isHistory={false} />
    ) : <></>
}
