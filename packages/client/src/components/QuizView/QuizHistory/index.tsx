import { JSX } from 'preact/jsx-runtime';
import { ViewAttempt } from './ViewAttempt';
import { HistoryList } from './HistoryList';
import { HistoryStats } from './HistoryStats';
import { useMountedState } from '../../../hooks';
import { useEffect, useState } from 'preact/hooks';
import { QuizDetailHeader } from '../QuizDetailHeader';
import API, { PopulatedQuizHistoryType } from '../../../utils/api';
import { useCurrentFileSignal, useInViewAttemptSignal } from '../../../signals';
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

const divContainerClasses = 'h-full min-h-[calc(100vh-10vh)] flex-col justify-start items-center p-2';


export function QuizHistory(): JSX.Element {//NOSONAR
    const [stats, setStats] = useState<IHistoryStats | null>(null);
    const [currentHistory, setCurrentHistory] = useState<PopulatedQuizHistoryType[]>([]);
    const [viewAttempt, setViewAttempt] = useState<PopulatedQuizHistoryType | null>(null);
    const { inViewAttempt, setInViewAttempt } = useInViewAttemptSignal();
    const { fileDetails } = useCurrentFileSignal();
    const isMounted = useMountedState();

    const currentFile: QuizModelResponse | null = fileDetails.value;

    const handleSetViewAttempt = (attempt: PopulatedQuizHistoryType) => {
        if (attempt) {
            setInViewAttempt(true);
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

    // handles the back button logic.
    useEffect(() => {
        if (!inViewAttempt.value && viewAttempt) setViewAttempt(null);
    }, [inViewAttempt.value]);


    return isMounted && (currentHistory?.length ?? 0) > 0 ? (
        <div className={divContainerClasses}>
            <QuizDetailHeader isHistory={true} />
            {
                (currentHistory !== null && !viewAttempt) ? (
                    <>
                        {stats && <HistoryStats stats={stats.stats} />}
                        <HistoryList
                            history={currentHistory ?? []}
                            setViewAttempt={handleSetViewAttempt}
                        />
                    </>
                ) :
                    <ViewAttempt attempt={viewAttempt} />
            }
        </div>
    ) : <></>
}
