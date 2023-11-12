import { useSelectedFileState, SelectedFileState, useInfoDrawerState, useQuizViewState, InfoDrawerState } from '../../signals';
import { QuizViewRouter, QuizViews } from '../QuizView';
import { useMountedState } from '../../hooks';
import { useEffect } from 'preact/hooks';


export function MainView(): JSX.Element {
    const { currentQuizView, setCurrentQuizView } = useQuizViewState();
    const { selectedFile }: SelectedFileState = useSelectedFileState();
    const { isDrawerOpen }: InfoDrawerState = useInfoDrawerState();
    const isMounted: boolean = useMountedState();

    const currentFile = selectedFile.value;

    const width = !isDrawerOpen.value ? 'w-[calc(100vw-50px)]' : 'w-[calc(66%-45px)] lg:w-[calc(75%-50px)] xl:w-[calc(83%-45px)]';
    const mainClasses = `bg-slate-950 h-[calc(100vh-44px)] ${width} p-1 overflow-y-scroll p-1`

    useEffect(() => {
        if (isMounted && currentFile !== '' || isMounted && currentFile === '') {
            setCurrentQuizView(QuizViews.QuizDetails);
        }
    }, [isMounted, currentFile]);

    return (
        <main className={mainClasses}>
            <div className={'w-full min-h-[calc(100vh-44px)] bg-gray-900 rounded-sm p-3'}>
                {isDrawerOpen.value && <QuizViewRouter view={currentQuizView.value} />}
            </div>
        </main>
    )
}

export default MainView;

export { MainViewContainer } from './MainViewContainer';
