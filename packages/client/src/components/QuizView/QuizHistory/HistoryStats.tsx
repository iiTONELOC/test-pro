import { IHistoryStats } from '.';
import { JSX } from 'preact/jsx-runtime';
import { displayElapsedTime } from '../../../utils';



export function HistoryStats({ stats }: Readonly<IHistoryStats>): JSX.Element {//NOSONAR
    const { bestTime, numberOfAttempts, averageScore, averageTime, lastFiveAverageScore, lastFiveAverageTime } = stats;

    return numberOfAttempts > 0 ? (
        <div className={'w-full h-auto flex flex-wrap flex-row justify-center'}>
            <div className={'bg-slate-950 rounded-md w-max h-max py-2 px-4 mb-6 text-left lg:text-center'}>
                <h2 className={'text-2xl mb-4'}>Stats</h2>
                <div className={'w-full h-auto flex flex-col gap-2 text-sm  md:text-md lg:text-base'}>
                    <p>Best Time: {displayElapsedTime(bestTime)}</p>
                    <p>Number of Attempts: {numberOfAttempts}</p>
                    <p>Overall Average Score: {averageScore.toFixed(2)}%</p>
                    <p>Overall Average Time: {displayElapsedTime(averageTime)}</p>
                    <p>Average Score - Last Five Attempts: {lastFiveAverageScore.toFixed(2)}%</p>
                    <p>Average Time - Last Five Attempts: {displayElapsedTime(lastFiveAverageTime)}</p>
                </div>
            </div>
        </div>

    ) : <></>;
}
