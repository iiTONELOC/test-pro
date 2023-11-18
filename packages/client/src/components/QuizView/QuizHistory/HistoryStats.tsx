import { JSX } from 'preact/jsx-runtime';
import { PopulatedQuizHistoryType } from '../../../utils/api';
import { calculateAverage, calculateScore, displayElapsedTime } from '../../../utils';

export interface HistoryStatsProps {
    history: PopulatedQuizHistoryType[];
}

export function HistoryStats({ history }: Readonly<HistoryStatsProps>): JSX.Element {
    console.log({ history })
    const averageScore = history.length = 0 ? 0 : calculateAverage(history.map(h => calculateScore(h.attempt.earnedPoints, h.attempt.answeredQuestions.length)));
    const averageTime = history.length = 0 ? 0 : calculateAverage(history.map(h => (h.attempt.elapsedTimeInMs ?? 0)));

    return history.length > 0 ? (
        <div>
            <h1>History Stats</h1>
            <div>
                <p>Average Score: {averageScore}</p>
                <p>Number of Attempts: {history.length}</p>
                <p>Average Time: {displayElapsedTime(averageTime)}</p>
            </div>
        </div>
    ) : <></>
}
