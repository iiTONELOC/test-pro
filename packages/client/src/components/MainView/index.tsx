import { JSX } from 'preact/jsx-runtime';
import { QuizViewRouter } from '../QuizView';
import { useMountedState } from '../../hooks';
import { ToggleDrawer } from './ToggleDrawer';
import { useInfoDrawerSignal, InfoDrawerSignal } from '../../signals';


export const MainView = (): JSX.Element => {// NOSONAR
    const { isDrawerOpen }: InfoDrawerSignal = useInfoDrawerSignal();
    const isMounted: boolean = useMountedState();

    const width = !isDrawerOpen.value ?
        'w-[calc(100vw-50px)]' :
        'w-[calc(66%-45px)] lg:w-[calc(75%-50px)] xl:w-[calc(83%-45px)]';

    const mainClasses = `bg-slate-950 h-[calc(100vh-56px)]  ${width} p-1 scroll-smooth overflow-auto flex flex-wrap flex-row justify-start`;

    return isMounted ? (
        <main className={mainClasses} >
            <ToggleDrawer />
            <QuizViewRouter />
        </main>
    ) : <></>;
};

export default MainView;

export { MainViewContainer } from './MainViewContainer';
