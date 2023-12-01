import { JSX } from 'preact/jsx-runtime';
import { AnsweredQuizQuestion } from './AnsweredQuestion';
import { dateTime, displayElapsedTime, uuid } from '../../../utils';
import { PopulatedQuizHistoryType, PopulatedQuizQuestionResultType } from '../../../utils/api';


function HideAttempt({ hideAttempt }: Readonly<{ hideAttempt: (event: Event) => void }>): JSX.Element {
    return (
        <button
            onClick={hideAttempt}
            className={'bg-slate-700 py-2 px-3 rounded-md hover:bg-red-700 mb-8 text-xl'}>Hide Attempt</button>
    )
}
export function ViewAttempt({ attempt, hideAttempt }: Readonly<{ attempt: PopulatedQuizHistoryType | null, hideAttempt: () => void }>): JSX.Element {
    const { earnedPoints, elapsedTimeInMs, passed, dateTaken, answeredQuestions } = attempt?.attempt || {};

    const headerDetails = [
        { label: 'Date Taken', value: dateTime(dateTaken as Date) },
        { label: 'Passed', value: passed ? 'Yes' : 'No' },
        { label: 'Earned Points', value: earnedPoints },
        { label: 'Elapsed Time', value: displayElapsedTime(elapsedTimeInMs ?? 0) },
    ];

    const handleClick = (event: Event) => {
        event.stopPropagation();
        event.preventDefault();
        hideAttempt();
    };

    return (
        <section className={' bg-slate-900 w-full h-full text-gray-300 flex flex-col justify-start items-center gap-6 mt-6 p-2'}>


            <h2 className={'my-3 text-3xl underline underline-offset-2'}>Results for Quiz Attempt</h2>

            <div className={'flex flex-wrap flex-row justify-between bg-slate-950 rounded-md w-full lg:w-[85%] border-2 border-slate-700'}>
                {headerDetails.map(({ label, value }) => (
                    <div className={'flex flex-col p-2'} key={uuid()}>
                        <span className={' font-bold'}>{label}</span>
                        <span className={''}>{value}</span>
                    </div>
                ))}
            </div>

            <section className={' bg-slate-900  w-full h-auto flex flex-col justify-start items-center gap-4 mb-3 mt-3'}>
                <HideAttempt hideAttempt={handleClick} />
                <ul className={'w-full h-auto flex flex-col justify-start items-center gap-3 mb-3'}>
                    {answeredQuestions?.map(question =>
                        // @ts-ignore
                        <AnsweredQuizQuestion key={uuid()} questionResult={question as PopulatedQuizQuestionResultType} />
                    )}
                </ul>
                <HideAttempt hideAttempt={handleClick} />
            </section>


        </section>
    )
}
