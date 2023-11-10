import { TopBar, Footer, ActionBar, InfoDrawer, MainView } from './';
import { useEffect, useState } from 'preact/hooks';
import { useInfoDrawerState } from '../signals';
import { useMountedState } from '../hooks'
import API from '../utils/api';

import type { QuizModelResponse, dbQueryParams } from '../utils/api';

const containerClasses = 'w-full h-full fixed left-12 top-8 flex flex-row';

function MainViewContainer() {
    const [quizzes, setQuizzes] = useState<QuizModelResponse[] | null>(null);
    const [didFetch, setDidFetch] = useState<boolean>(false);
    const { isDrawerOpen } = useInfoDrawerState();
    const isMounted: boolean = useMountedState();
    const isOpen = isDrawerOpen.value;

    useEffect(() => {
        if (isMounted && isOpen && !didFetch) {
            const quizProps: dbQueryParams = {
                showTimestamps: false,
                needToPopulate: true
            };

            (async () => {
                const _quizzes = await API.getAllQuizzes(quizProps);
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
                    quizProps.needToPopulate = true;
                    const _quizzes = await API.getAllQuizzes(quizProps);
                    setQuizzes(_quizzes);
                }
            })();
        }
    }, [isMounted, isOpen]);



    return isMounted && quizzes ? (
        <div className={containerClasses}>
            <InfoDrawer isOpen={isOpen} quizData={quizzes} />
            <MainView isOpen={isOpen} />
        </div>
    ) : <></>
}

export function Layout() {
    return (
        <>
            <TopBar />
            <ActionBar />
            <MainViewContainer />
            <Footer />
        </>
    );
}

