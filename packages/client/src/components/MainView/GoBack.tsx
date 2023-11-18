import { ToolTip } from '../ToolTip';
import { clickHandler } from '../../utils';
import { ArrowLeftCircle } from '../../assets/icons/ArrowLeftCircle';
import { useSelectedFileSignal, useInfoDrawerSignal, useQuizViewSignal, QuizViews } from '../../signals';


const arrowClasses = 'w-8 h-8 hover:w-10 hover:h-10 transition-all hover:text-emerald-600';

export function GoBack() { // NOSONAR
    const { isDrawerOpen, toggleDrawer } = useInfoDrawerSignal();
    const { selectedFile, setSelectedFile } = useSelectedFileSignal();
    const { currentQuizView, setCurrentQuizView } = useQuizViewSignal();

    const handleGoBack = () => {
        if (currentQuizView.value === QuizViews.QuizDetails) {
            setSelectedFile('');
            !isDrawerOpen.value && toggleDrawer();
        } else {
            setCurrentQuizView(QuizViews.QuizDetails);
        }
    };

    const handleClick = (event: Event) => {
        clickHandler({
            event: event as MouseEvent,
            callback: handleGoBack,
            stopPropagation: true
        });
    }

    return selectedFile.value !== '' ? (
        <button onClick={handleClick} className={'absolute bg-slate-900/[.8] rounded-full z-10'}>
            <ToolTip toolTipText='Click to go back' >
                <ArrowLeftCircle className={arrowClasses} />
            </ToolTip>
        </button>
    ) : <></>
}
