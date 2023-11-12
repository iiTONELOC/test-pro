import { useSelectedFileState, SelectedFileState, useQuizzesDbState, QuizzesDbState } from '../../signals';
import { useEffect, useState } from 'preact/hooks';
import { QuizModelResponse } from '../../utils/api';
import { useMountedState } from '../../hooks';

/**
 * The different views that can be displayed in the main view
 * ```ts
 *  enum QuizViews {
 *     QuizDetails = 'QuizDetails',
 *     Quiz = 'Quiz',
 *     QuizEdit = 'QuizEdit',
 *     QuizCreate = 'QuizCreate',
 *     QuizDelete = 'QuizDelete',
 *     QuizHistory = 'QuizHistory'
 * }
 * ```
 */
export enum QuizViews {
    QuizDetails = 'QuizDetails',
    Quiz = 'Quiz',
    QuizEdit = 'QuizEdit',
    QuizCreate = 'QuizCreate',
    QuizDelete = 'QuizDelete',
    QuizHistory = 'QuizHistory'
}

export function QuizViewRouter({ view }: Readonly<{ view: QuizViews }>): JSX.Element {
    switch (view) {
        case QuizViews.QuizDetails:
            return <QuizView />;
        case QuizViews.Quiz:
            return <>QuizExam </>;
        case QuizViews.QuizEdit:
            return <>QuizEdit </>;
        case QuizViews.QuizCreate:
            return <>QuizCreate </>;
        case QuizViews.QuizDelete:
            return <>QuizDelete </>;
        case QuizViews.QuizHistory:
            return <>QuizHistory </>;
        default:
            return <QuizView />;
    }
}

export function QuizView(): JSX.Element {
    const [currentFileDetails, setCurrentFileDetails] = useState<QuizModelResponse | null>(null);
    const { selectedFile }: SelectedFileState = useSelectedFileState();
    const { quizzesDb }: QuizzesDbState = useQuizzesDbState();
    const isMounted: boolean = useMountedState();

    const currentFile = selectedFile.value;

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
        <div>
            {currentFileDetails && <pre className={'text-sm'}>
                <h1>Quiz</h1>
                {JSON.stringify(currentFileDetails, null, 2)}
            </pre>}
            {!currentFileDetails && <p className={'text-gray-300 text-center text-base'}>
                Select a quiz to view its details
            </p>}
        </div>
    )
}

export default QuizView
