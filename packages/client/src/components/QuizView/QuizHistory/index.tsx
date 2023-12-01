import { JSX } from 'preact/jsx-runtime';
import { ViewAttempt } from './ViewAttempt';
import { HistoryList } from './HistoryList';
import { HistoryStats } from './HistoryStats';
import { useMountedState } from '../../../hooks';
import { useEffect, useState } from 'preact/hooks';
import { useCurrentFileSignal } from '../../../signals';
import API, { PopulatedQuizHistoryType } from '../../../utils/api';
import { QuizModelResponse, calculateAverage, calculateScore } from '../../../utils';

export interface IHistoryStats {
    stats: {
        bestTime: number;
        numberOfAttempts: number;
        averageScore: number;
        averageTime: number;
        lastFiveAverageScore: number;
        lastFiveAverageTime: number;
    }
}

const generateHistoryStats = (history: PopulatedQuizHistoryType[]): IHistoryStats => {
    const numberOfAttempts = history.length;
    const lastFiveAttempts = history.slice(0, 5);
    const averageScore = calculateAverage(history.map(h => calculateScore(h.attempt.earnedPoints, h.attempt.answeredQuestions.length)));
    const averageTime = calculateAverage(history.map(h => (h.attempt.elapsedTimeInMs ?? 0)));
    const lastFiveAverageScore = calculateAverage(lastFiveAttempts.map(h => calculateScore(h.attempt.earnedPoints, h.attempt.answeredQuestions.length)));
    const lastFiveAverageTime = calculateAverage(lastFiveAttempts.map(h => (h.attempt.elapsedTimeInMs ?? 0)));
    const bestTime = Math.min(...history.map(h => (h.attempt.elapsedTimeInMs ?? 0)));

    return {
        stats: {
            bestTime,
            numberOfAttempts,
            averageScore,
            averageTime,
            lastFiveAverageScore,
            lastFiveAverageTime
        }
    };
};

export function QuizHistory(): JSX.Element {//NOSONAR
    const [stats, setStats] = useState<IHistoryStats | null>(null);
    const [currentHistory, setCurrentHistory] = useState<PopulatedQuizHistoryType[]>([]);
    const [viewAttempt, setViewAttempt] = useState<PopulatedQuizHistoryType | null>(null);
    const { fileDetails } = useCurrentFileSignal();
    const isMounted = useMountedState();

    const currentFile: QuizModelResponse | null = fileDetails.value;

    const handleSetViewAttempt = (attempt: PopulatedQuizHistoryType) => {
        if (attempt) {
            setViewAttempt(attempt);
        }
    };

    useEffect(() => {
        if (currentFile && isMounted) {
            (async () => {
                // fetch the history for the current quiz
                const history = await API.getQuizHistoriesForQuiz(
                    currentFile._id.toString(),
                    {
                        showTimestamps: false,
                        needToPopulate: true
                    }
                );

                setCurrentHistory(history?.reverse() ?? []);
                history && setStats(generateHistoryStats(history));
            })();
        }
    }, [currentFile, isMounted]);


    return isMounted && currentHistory !== null ?   //NOSONAR
        <>
            {stats && !viewAttempt && <HistoryStats stats={stats.stats} />}
            {viewAttempt && <ViewAttempt attempt={viewAttempt} hideAttempt={() => setViewAttempt(null)} />}
            {!viewAttempt && <HistoryList
                history={currentHistory ?? []}
                setViewAttempt={handleSetViewAttempt}
            />}

        </>
        : <></>
}
