import { JSX } from 'preact/jsx-runtime';
import { PopulatedQuizHistoryType } from '../../../utils/api';
import { calculateAverage, calculateScore, displayElapsedTime } from '../../../utils';

export interface HistoryStatsProps {
    history: PopulatedQuizHistoryType[];
}

export function HistoryStats({ history }: Readonly<HistoryStatsProps>): JSX.Element {//NOSONAR
    const averageScore = calculateAverage(history.map(h => calculateScore(h.attempt.earnedPoints, h.attempt.answeredQuestions.length)));
    const averageTime = calculateAverage(history.map(h => (h.attempt.elapsedTimeInMs ?? 0)));

    const lastFiveAttempts = history.slice(0, 5);
    const lastFiveAverageScore = calculateAverage(lastFiveAttempts.map(h => calculateScore(h.attempt.earnedPoints, h.attempt.answeredQuestions.length)));
    const lastFiveAverageTime = calculateAverage(lastFiveAttempts.map(h => (h.attempt.elapsedTimeInMs ?? 0)));

    const bestTime = Math.min(...history.map(h => (h.attempt.elapsedTimeInMs ?? 0)));


    return history.length > 0 ? (
        <div className={'w-full h-auto flex flex-wrap flex-row justify-center'}>
            <div className={'bg-slate-950 rounded-md w-max h-max py-2 px-4 mb-6 text-left lg:text-center'}>
                <h2 className={'text-2xl mb-4'}>Stats</h2>
                <div className={'w-full h-auto flex flex-col gap-2 text-base'}>
                    <p>Best Time: {displayElapsedTime(bestTime)}</p>
                    <p>Number of Attempts: {history.length}</p>
                    <p>Overall Average Score: {averageScore.toFixed(2)}%</p>
                    <p>Overall Average Time: {displayElapsedTime(averageTime)}</p>

                    <p>Average Score - Last Five Attempts: {lastFiveAverageScore.toFixed(2)}%</p>
                    <p>Average Time - Last Five Attempts: {displayElapsedTime(lastFiveAverageTime)}</p>
                </div>
            </div>
        </div>

    ) : <></>;
}
