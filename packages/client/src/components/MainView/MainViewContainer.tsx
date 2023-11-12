import { API, defaultAPIQueryParams } from '../../utils';
import { useEffect, useState } from 'preact/hooks';
import { useInfoDrawerState } from '../../signals';
import { useMountedState } from '../../hooks'
import { InfoDrawer, MainView } from '../';

import type { QuizModelResponse, dbQueryParams } from '../../utils';

export function MainViewContainer() { //NOSONAR
    const containerClasses = 'w-full h-full fixed left-12 top-8 flex flex-row';
    const [quizzes, setQuizzes] = useState<QuizModelResponse[] | null>(null);
    const [didFetch, setDidFetch] = useState<boolean>(false);
    const { isDrawerOpen } = useInfoDrawerState();

    const isOpen = isDrawerOpen.value;
    const isMounted: boolean = useMountedState();

    useEffect(() => {
        if (isMounted && isOpen && !didFetch) {
            (async () => {
                const _quizzes = await API.getAllQuizzes(defaultAPIQueryParams);
                setQuizzes(_quizzes);
                setDidFetch(true);
            })();
        }

        if (isMounted && isOpen && didFetch) {
            console.log('Re-opening drawer, checking for new quizzes');
            const quizProps: dbQueryParams = {
                showTimestamps: false,
                needToPopulate: false
            };

            (async () => {
                const currentQuizzes = await API.getAllQuizzes(quizProps);
                const currentNumQuizzes = currentQuizzes.length;
                const previousNumQuizzes = quizzes?.length;

                // if the number of quizzes has changed, update the state
                if (currentNumQuizzes !== previousNumQuizzes) {
                    const _quizzes = await API.getAllQuizzes(defaultAPIQueryParams);
                    setQuizzes(_quizzes);
                }
            })();
        }
    }, [isMounted, isDrawerOpen.value]);

    return isMounted && quizzes ? (
        <div className={containerClasses}>
            <InfoDrawer quizData={quizzes} />
            <MainView />
        </div>
    ) : <></>
}

export default MainViewContainer;
