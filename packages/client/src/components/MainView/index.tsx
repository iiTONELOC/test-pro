import { useSelectedFileState, SelectedFileState, useInfoDrawerState, useQuizViewState, InfoDrawerState } from '../../signals';
import { useVirtualScrollBar } from '../VirtualScrollBar';
import { useEffect, useRef, useState } from 'preact/hooks';
import { QuizViewRouter, QuizViews } from '../QuizView';
import { useMountedState } from '../../hooks';



export const MainView = (): JSX.Element => {
    const [isOverflowing, setIsOverflowing] = useState<boolean>(false);
    const { currentQuizView, setCurrentQuizView } = useQuizViewState();
    const { selectedFile }: SelectedFileState = useSelectedFileState();
    const { isDrawerOpen }: InfoDrawerState = useInfoDrawerState();
    const containerRef = useRef<HTMLDivElement>(null);
    const isMounted: boolean = useMountedState();

    const { VirtualScrollBar, handleMouseDown, handleMouseMove, handleMouseUp } = useVirtualScrollBar({ containerRef });

    const currentFile = selectedFile.value;
    const width = !isDrawerOpen.value ? 'w-[calc(100vw-50px)]' : 'w-[calc(66%-45px)] lg:w-[calc(75%-50px)] xl:w-[calc(83%-45px)]';
    const mainClasses = `static bg-slate-950 h-[calc(100vh-40px)] ${width} p-1 overflow-y-auto bg-pink-900 p-1 scroll-smooth`;

    // check to see if the container is overflowing in a horizontal direction
    useEffect(() => {
        const container = containerRef.current;

        const checkForOverflow = () => {
            if (container) {
                const containerWidth = container.getBoundingClientRect().width;
                const overflowing = containerWidth < 450;
                setIsOverflowing(overflowing);
            }
        };

        if (isMounted && currentFile !== '') {
            checkForOverflow();
            window?.addEventListener('resize', checkForOverflow);
        }

        return () => window?.removeEventListener('resize', checkForOverflow);
    }, [isDrawerOpen, currentFile, isMounted]);

    // set the default view to QuizDetails when a file is selected
    useEffect(() => {
        if (isMounted && currentFile !== '') {
            setCurrentQuizView(QuizViews.QuizDetails);
        }
    }, [isMounted, currentFile, setCurrentQuizView]);


    return (
        <main
            className={mainClasses}
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
        >
            <div
                ref={containerRef}
                className={'w-full min-h-[calc(100vh-54px)] bg-gray-900 rounded-sm p-3 overflow-auto'}
            >
                {<QuizViewRouter view={currentQuizView.value} />}
            </div>
            {isOverflowing && <VirtualScrollBar />}
        </main>
    );
};

export default MainView;

export { MainViewContainer } from './MainViewContainer';
