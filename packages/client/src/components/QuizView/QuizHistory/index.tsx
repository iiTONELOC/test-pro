import { JSX } from 'preact/jsx-runtime';
import { HistoryList } from './HistoryList';
import { HistoryStats } from './HistoryStats';
import { useMountedState } from '../../../hooks';
import { useEffect, useState } from 'preact/hooks';
import { QuizModelResponse } from '../../../utils';
import { QuizDetailHeader } from '../QuizDetailHeader';
import { useCurrentFileSignal } from '../../../signals';
import API, { PopulatedQuizHistoryType } from '../../../utils/api';


const divContainerClasses = 'h-full min-h-[calc(100vh-10vh)] flex-col justify-start justify-between p-2';

export function QuizHistory(): JSX.Element {//NOSONAR
    const [currentHistory, setCurrentHistory] = useState<PopulatedQuizHistoryType[] | null>(null);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const { fileDetails } = useCurrentFileSignal();
    const isMounted = useMountedState();

    const currentFile: QuizModelResponse | null = fileDetails.value

    useEffect(() => {
        if (currentFile !== null && isMounted) {
            (async () => {
                const history = await API
                    .getQuizHistoriesForQuiz(currentFile._id.toString(), { showTimestamps: false, needToPopulate: true });

                console.log(history);
                setCurrentHistory(history);
            })();
        }
    }, [currentFile, isMounted]);


    // make a copy of the current history so we dont mutate the original
    const currentHistoryCopy = currentHistory?.slice() ?? [];
    return isMounted && (currentHistory?.length ?? 0) > 0 ? (
        <div className={divContainerClasses}>
            <QuizDetailHeader isHistory={true} />
            {currentHistory !== null && (
                <>
                    <HistoryStats history={currentHistoryCopy ?? []} />
                    <HistoryList history={currentHistory ?? []} handleIndexChange={{ selectedIndex, setSelectedIndex }} />
                </>
            )}

        </div>
    ) : <></>
}
