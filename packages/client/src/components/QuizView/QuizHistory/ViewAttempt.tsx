import { JSX } from 'preact/jsx-runtime';
import { AnsweredQuizQuestion } from './AnsweredQuestion';
import { dateTime, displayElapsedTime, uuid } from '../../../utils';
import { PopulatedQuizHistoryType, PopulatedQuizQuestionResultType } from '../../../utils/api';


export function ViewAttempt({ attempt }: Readonly<{ attempt: PopulatedQuizHistoryType | null }>): JSX.Element {
    const { earnedPoints, elapsedTimeInMs, passed, dateTaken, answeredQuestions } = attempt?.attempt || {};

    const headerDetails = [
        { label: 'Date Taken', value: dateTime(dateTaken as Date) },
        { label: 'Passed', value: passed ? 'Yes' : 'No' },
        { label: 'Earned Points', value: earnedPoints },
        { label: 'Elapsed Time', value: displayElapsedTime(elapsedTimeInMs ?? 0) },
    ];

    return (
        <section className={'w-full h-full overflow-auto text-gray-200'}>
            <div className={'flex flex-wrap flex-row justify-between bg-slate-950 rounded-md'}>
                {headerDetails.map(({ label, value }) => (
                    <div className={'flex flex-col p-2'} key={uuid()}>
                        <span className={' font-bold'}>{label}</span>
                        <span className={''}>{value}</span>
                    </div>
                ))}
            </div>

            <section className={'w-full h-auto flex flex-col justify-start items-center gap-4 mb-3 mt-3'}>
                <h2 className={'my-3 text-3xl underline underline-offset-2'}>Results</h2>
                <div className={'w-full h-auto flex flex-col justify-start items-center gap-3 mb-3'}>
                    {answeredQuestions?.map(question =>
                        // @ts-ignore
                        <AnsweredQuizQuestion key={uuid()} questionResult={question as PopulatedQuizQuestionResultType} />
                    )}
                </div>
            </section>
        </section>
    )
}
