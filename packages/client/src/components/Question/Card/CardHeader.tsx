
import { uuid } from '../../../utils';
import { TopicTag } from '../../TopicTag';
import { JSX } from 'preact/jsx-runtime';

export interface ICardHeaderProps {
    questionNumber?: number;
    totalNumberOfQuestions?: number;
    topics?: string[];
}

export function CardHeader({ questionNumber, topics, totalNumberOfQuestions }: ICardHeaderProps): JSX.Element {//NOSONAR
    return (
        <header className={'w-auto flex flex-col place-content-start'}>
            {
                questionNumber && totalNumberOfQuestions && (
                    <h2 className={'text-xs '}>
                        Question {questionNumber} of {totalNumberOfQuestions}
                    </h2>
                )
            }
            <span className={'flex flex-wrap flex-row gap-2 text-xs mt-1'}>
                {topics?.map((topic: string) =>
                    <TopicTag key={uuid()} topic={topic ?? ''} />
                )}
            </span>
        </header>
    )
}
