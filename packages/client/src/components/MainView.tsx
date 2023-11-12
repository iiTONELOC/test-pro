import { useSelectedFileState, SelectedFileState, useQuizzesDbState, QuizzesDbState, useInfoDrawerState } from '../signals';
import { useEffect, useState } from 'preact/hooks';
import { QuizModelResponse } from '../utils/api';
import { useMountedState } from '../hooks';


export function MainView(): JSX.Element {
    const [currentFileDetails, setCurrentFileDetails] = useState<QuizModelResponse | null>(null);
    const { selectedFile }: SelectedFileState = useSelectedFileState();
    const { quizzesDb }: QuizzesDbState = useQuizzesDbState();
    const isMounted: boolean = useMountedState();
    const { isDrawerOpen } = useInfoDrawerState();

    const currentFile = selectedFile.value;
    const isClosed = !isDrawerOpen.value;

    const width = isClosed ? 'w-[calc(100vw-50px)]' : 'w-[calc(66%-45px)] lg:w-[calc(75%-50px)] xl:w-[calc(83%-45px)]';
    const mainClasses = `bg-slate-950 h-[calc(100vh-44px)] ${width} p-1 overflow-y-scroll p-1`

    // handles the view of the current file
    useEffect(() => {
        // if the currentFile isn't empty, find the file in the db
        if (isMounted && currentFile !== '') {
            const details = [...quizzesDb.value]
                .filter((quiz: QuizModelResponse) => quiz._id.toString() === currentFile)[0];
            if (details) {
                setCurrentFileDetails(details);
            } else {
                // Todo: try to fetch from server
                console.error(`Could not find quiz with id ${currentFile}`);
            }
        }
        // if the currentFile is empty, set the currentFileDetails to null
        if (isMounted && currentFile === '') {
            setCurrentFileDetails(null);
        }
    }, [isMounted, currentFile]);

    return (
        <main className={mainClasses}>
            <div className={'w-full min-h-[calc(100vh-44px)] bg-gray-900 rounded-sm p-3'}>
                {currentFileDetails && <pre className={'text-sm'}>
                    {JSON.stringify(currentFileDetails, null, 2)}
                </pre>}
                {!currentFileDetails && <p className={'text-gray-300 text-center text-base'}>
                    Select a quiz to view its details
                </p>}
            </div>
        </main>
    )
}
