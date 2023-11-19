import { JSX } from 'preact/jsx-runtime';
import { PopulatedQuizHistoryType } from '../../../utils/api';
import { calculateScore, dateTime, trimClasses, displayElapsedTime } from '../../../utils';


const buttonClasses = `bg-slate-800 w-full hover:cursor-pointer hover:bg-slate-700 p-3 flex 
flex-wrap flex-row gap-2 justify-between items-center rounded-md text-gray-300 ease-in-out-300
transition-all focus:bg-slate-600 focus:border-2 focus:border-purple-500 focus:outline-none`;


export function HistoryListItem({ history }: Readonly<{ history: PopulatedQuizHistoryType }>): JSX.Element {
    const taken = dateTime(history.attempt.dateTaken);
    const passed = history.attempt.passed ? 'Passed' : 'Failed';
    const score = calculateScore(history.attempt.earnedPoints, history.attempt.answeredQuestions.length);

    const textBase = 'text-base';
    return (
        <button tabIndex={0} className={trimClasses(buttonClasses)}>
            <p className={textBase}>{taken}</p>
            <span className={'flex flex-wrap flex-row gap-2 items-center  '}>
                <p className={'text-md'}> Result: {passed}</p>
                <p className={'text-md'}> Score: {score}%</p>
                <p className={'text-md'}> Time: {displayElapsedTime(history.attempt.elapsedTimeInMs)}</p>
            </span>
        </button >
    )
}
