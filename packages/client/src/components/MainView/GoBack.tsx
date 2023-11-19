import { ToolTip } from '../ToolTip';
import { clickHandler, keyHandler } from '../../utils';
import { ArrowLeftCircle } from '../../assets/icons/ArrowLeftCircle';
import {
    useSelectedFileSignal, useInfoDrawerSignal,
    useQuizViewSignal, QuizViews,
    useInViewAttemptSignal
} from '../../signals';
import { useEffect } from 'preact/hooks';


const arrowClasses = 'w-8 h-8 hover:w-10 hover:h-10 transition-all hover:text-emerald-600';

export function GoBack() { // NOSONAR
    const { isDrawerOpen, toggleDrawer } = useInfoDrawerSignal();
    const { selectedFile, setSelectedFile } = useSelectedFileSignal();
    const { inViewAttempt, setInViewAttempt } = useInViewAttemptSignal();
    const { currentQuizView, setCurrentQuizView } = useQuizViewSignal();

    const handleGoBack = () => {
        if (currentQuizView.value === QuizViews.QuizDetails) {
            setSelectedFile('');
            !isDrawerOpen.value && toggleDrawer();
        } else if (currentQuizView.value === QuizViews.QuizHistory && inViewAttempt.value) {
            setInViewAttempt(false);
        } else {
            setCurrentQuizView(QuizViews.QuizDetails);
        }
    };

    const handleClick = (event: Event) => clickHandler({
        event: event as MouseEvent,
        callback: handleGoBack,
        stopPropagation: true
    });

    const handleEscapeKey = (e: KeyboardEvent) => keyHandler({
        event: e,
        keyToWatch: 'Escape',
        callback: handleGoBack,
        stopPropagation: true
    });

    const addEscapeKeyListener = () => document.addEventListener('keydown', handleEscapeKey);
    const removeEscapeKeyListener = () => document.removeEventListener('keydown', handleEscapeKey);

    useEffect(() => {
        addEscapeKeyListener();
        return () => removeEscapeKeyListener();
    }, []);


    return selectedFile.value !== '' ? (
        <button onClick={handleClick} className={'absolute bg-slate-900/[.8] rounded-full z-10'}>
            <ToolTip toolTipText='Click or press Escape to go back' >
                <ArrowLeftCircle className={arrowClasses} />
            </ToolTip>
        </button>
    ) : <></>
}
