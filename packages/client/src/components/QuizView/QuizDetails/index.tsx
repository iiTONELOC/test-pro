import { JSX } from 'preact/jsx-runtime';
import { QuizHistory, QuizViews } from '..';
import { trimClasses } from '../../../utils';
import QuizInfoHeader from './QuizInfoHeader';
import { ActionButtons } from './ActionButtons';
import { useMountedState } from '../../../hooks';
import { useEffect, useState } from 'preact/hooks';
import { useQuizViewSignal, useSelectedFileSignal } from '../../../signals';


const divContainerClasses = `h-full w-full bg-slate-900 flex flex-col justify-start  ease-in-out duration-300 transition-all `;


export function QuizDetails(): JSX.Element {// NOSONAR
    const [showHistory, setShowHistory] = useState<boolean>(false);
    const { currentQuizView, setCurrentQuizView } = useQuizViewSignal();
    const { selectedFile } = useSelectedFileSignal();
    const isMounted: boolean = useMountedState();


    useEffect(() => {
        if (isMounted && currentQuizView.value === QuizViews.QuizHistory) {
            setShowHistory(true);
        }
    }, [isMounted]);

    const handleToggleHistory = () => {
        setShowHistory(!showHistory);
        if (showHistory) {
            setCurrentQuizView(QuizViews.QuizHistory);
        } else {
            setCurrentQuizView(QuizViews.QuizDetails);
        }
    }

    return selectedFile.value !== '' ? (
        <div className={trimClasses(divContainerClasses)}>
            <QuizInfoHeader showHistory={showHistory} />
            <ActionButtons toggleHistory={handleToggleHistory} showHistory={showHistory} />
            {showHistory && <QuizHistory />}
        </div>
    ) : <></>
}

export default QuizDetails
