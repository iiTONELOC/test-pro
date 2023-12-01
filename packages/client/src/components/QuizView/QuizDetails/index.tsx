import { JSX } from 'preact/jsx-runtime';
import { QuizHistory, QuizViews } from '..';
import { trimClasses } from '../../../utils';
import QuizInfoHeader from './QuizInfoHeader';
import { ActionButtons } from './ActionButtons';
import { useEffect, useState } from 'preact/hooks';
import { useQuizViewSignal } from '../../../signals';
import { useMountedState, useShowQuizDetails } from '../../../hooks';

const divContainerClasses = `h-full w-full bg-slate-900 flex flex-col justify-start  ease-in-out duration-300 transition-all `;


export function QuizDetails(): JSX.Element {// NOSONAR
    const [showHistory, setShowHistory] = useState<boolean>(false);
    const { currentQuizView } = useQuizViewSignal();
    const isMounted: boolean = useMountedState();
    const showQuizDetails = useShowQuizDetails();

    useEffect(() => {
        if (currentQuizView.value !== QuizViews.QuizHistory) {
            setShowHistory(false);
        } else {
            setShowHistory(true);
        }
    }, [currentQuizView.value]);

    return isMounted && showQuizDetails ? (
        <div className={trimClasses(divContainerClasses)}>
            <QuizInfoHeader showHistory={showHistory} />
            <ActionButtons toggleHistory={() => setShowHistory(!showHistory)} showHistory={showHistory} />
            {showHistory && <QuizHistory />}
        </div>
    ) : <></>
}

export default QuizDetails
