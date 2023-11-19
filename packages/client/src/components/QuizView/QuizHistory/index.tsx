
import { JSX } from 'preact/jsx-runtime';
import { ViewAttempt } from './ViewAttempt';
import { HistoryList } from './HistoryList';
import { HistoryStats } from './HistoryStats';
import { useMountedState } from '../../../hooks';
import { useEffect, useState } from 'preact/hooks';
import { QuizModelResponse } from '../../../utils';
import { QuizDetailHeader } from '../QuizDetailHeader';
import API, { PopulatedQuizHistoryType } from '../../../utils/api';
import { useCurrentFileSignal, useInViewAttemptSignal } from '../../../signals';

const divContainerClasses = 'h-full min-h-[calc(100vh-10vh)] flex-col justify-start justify-between p-2';

export function QuizHistory(): JSX.Element {//NOSONAR
    const [currentHistory, setCurrentHistory] = useState<PopulatedQuizHistoryType[]>([]);
    const [viewAttempt, setViewAttempt] = useState<PopulatedQuizHistoryType | null>(null);
    const { inViewAttempt, setInViewAttempt } = useInViewAttemptSignal();
    const { fileDetails } = useCurrentFileSignal();
    const isMounted = useMountedState();

    const currentFile: QuizModelResponse | null = fileDetails.value;

    const handleSetViewAttempt = (attempt: PopulatedQuizHistoryType) => {
        if (attempt) {
            setViewAttempt(attempt);
            setInViewAttempt(true);
        }
    };

    useEffect(() => {
        if (currentFile && isMounted) {
            (async () => {
                const history = await API.getQuizHistoriesForQuiz(
                    currentFile._id.toString(),
                    {
                        showTimestamps: false,
                        needToPopulate: true
                    }
                );
                setCurrentHistory(history ?? []);
            })();
        }
    }, [currentFile, isMounted]);

    // handles the back button logic. The Go Back button sets the inViewAttempt to false on click, which triggers this useEffect
    // to set the viewAttempt to null, which triggers the ViewAttempt component to unmount
    useEffect(() => {
        if (!inViewAttempt.value && viewAttempt) setViewAttempt(null);
    }, [inViewAttempt.value]);


    return isMounted && (currentHistory?.length ?? 0) > 0 ? (
        <div className={divContainerClasses}>
            <QuizDetailHeader isHistory={true} />
            {
                (currentHistory !== null && !viewAttempt) ? (
                    <>
                        <HistoryStats history={currentHistory ?? []} />
                        <HistoryList
                            history={currentHistory.reverse() ?? []}
                            setViewAttempt={handleSetViewAttempt}
                        />
                    </>
                ) :
                    <ViewAttempt />
            }
        </div>
    ) : <></>
}
