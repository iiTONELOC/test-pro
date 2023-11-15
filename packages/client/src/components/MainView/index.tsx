import { useSelectedFileState, SelectedFileState, useInfoDrawerState, useQuizViewState, InfoDrawerState } from '../../signals';
import { useMountedState, useCheckForOverflow } from '../../hooks';
import { useVirtualScrollBar } from '../VirtualScrollBar';
import { QuizViewRouter, QuizViews } from '../QuizView';
import { useEffect, useRef } from 'preact/hooks';

export const MainView = (): JSX.Element => {// NOSONAR
    const { currentQuizView, setCurrentQuizView } = useQuizViewState();
    const { selectedFile }: SelectedFileState = useSelectedFileState();
    const { isDrawerOpen }: InfoDrawerState = useInfoDrawerState();
    const containerRef = useRef<HTMLDivElement>(null);
    const isMounted: boolean = useMountedState();

    const { hasOverflow } = useCheckForOverflow({ containerRef });
    const { VirtualScrollBar, handleMouseDown, handleMouseMove, handleMouseUp } = useVirtualScrollBar({ containerRef });

    const currentFile = selectedFile.value;
    const width = !isDrawerOpen.value ? 'w-[calc(100vw-50px)]' : 'w-[calc(66%-45px)] lg:w-[calc(75%-50px)] xl:w-[calc(83%-45px)]';
    const mainClasses = `static bg-slate-950 h-[calc(100vh-40px)] ${width} p-1 overflow-auto bg-pink-900 p-1 scroll-smooth`;


    useEffect(() => {
        if (isMounted && currentFile !== '') {
            setCurrentQuizView(QuizViews.QuizDetails);
        }
    }, [isMounted, currentFile, setCurrentQuizView]);


    return isMounted ? (
        <main
            className={mainClasses}
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
        >
            <div
                ref={containerRef}
                className={'w-full w-min-max min-h-[calc(100vh-54px)] bg-gray-900 rounded-sm p-3 overflow-auto'}
            >
                {<QuizViewRouter view={currentQuizView.value} />}
            </div>
            {hasOverflow && containerRef.current && <VirtualScrollBar />}
        </main>
    ) : <></>;
};

export default MainView;

export { MainViewContainer } from './MainViewContainer';
