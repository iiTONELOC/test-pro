import { useMountedState, useCheckForHorizontalOverflow } from '../../hooks';
import { useInfoDrawerSignal, InfoDrawerSignal } from '../../signals';
import { useVirtualScrollBar } from '../VirtualScrollBar';
import { QuizViewRouter } from '../QuizView';
import { useRef } from 'preact/hooks';
import { GoBack } from './GoBack';

const routerContainingDivClasses = 'w-full w-min-max min-h-[calc(100vh-54px)] bg-gray-900 rounded-sm p-3 overflow-auto';

export const MainView = (): JSX.Element => {// NOSONAR
    const { isDrawerOpen }: InfoDrawerSignal = useInfoDrawerSignal();
    const containerRef = useRef<HTMLDivElement>(null);
    const isMounted: boolean = useMountedState();

    const { hasOverflow } = useCheckForHorizontalOverflow({ containerRef });
    const { VirtualScrollBar, handleMouseDown, handleMouseMove, handleMouseUp } = useVirtualScrollBar({ containerRef });

    const width = !isDrawerOpen.value ? 'w-[calc(100vw-50px)]' : 'w-[calc(66%-45px)] lg:w-[calc(75%-50px)] xl:w-[calc(83%-45px)]';
    const mainClasses = `static bg-slate-950 h-[calc(100vh-40px)] ${width} p-1 overflow-auto bg-pink-900 p-1 scroll-smooth`;

    return isMounted ? (
        <main className={mainClasses} onMouseMove={handleMouseMove} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
            <div ref={containerRef} className={routerContainingDivClasses}>
                <GoBack />
                {<QuizViewRouter />}
            </div>
            {hasOverflow && containerRef.current && isDrawerOpen.value && <VirtualScrollBar />}
        </main>
    ) : <></>;
};

export default MainView;

export { MainViewContainer } from './MainViewContainer';
