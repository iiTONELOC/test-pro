import { GoBack } from './GoBack';
import { useRef } from 'preact/hooks';
import { JSX } from 'preact/jsx-runtime';
import { QuizViewRouter } from '../QuizView';
import { useMountedState } from '../../hooks';
import { useInfoDrawerSignal, InfoDrawerSignal } from '../../signals';


const routerContainingDivClasses = 'w-full w-min-max min-h-[calc(100vh-54px)] bg-gray-900 rounded-sm p-1';

export const MainView = (): JSX.Element => {// NOSONAR
    const { isDrawerOpen }: InfoDrawerSignal = useInfoDrawerSignal();
    const containerRef = useRef<HTMLDivElement>(null);
    const isMounted: boolean = useMountedState();

    const width = !isDrawerOpen.value ?
        'w-[calc(100vw-50px)]' :
        'w-[calc(66%-45px)] lg:w-[calc(75%-50px)] xl:w-[calc(83%-45px)]';

    const mainClasses = `bg-slate-950 h-[calc(100vh-38px)] ${width} p-1 scroll-smooth overflow-y-auto overflow-x-hidden`;

    return isMounted ? (
        <main className={mainClasses} >
            <div ref={containerRef} className={routerContainingDivClasses}>
                <GoBack />
                {<QuizViewRouter />}
            </div>
        </main>
    ) : <></>;
};

export default MainView;

export { MainViewContainer } from './MainViewContainer';
