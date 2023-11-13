import { useSelectedFileState, SelectedFileState, useQuizzesDbState, QuizzesDbState } from '../../signals';
import { useEffect, useState } from 'preact/hooks';
import { QuizModelResponse } from '../../utils/api';
import { useMountedState } from '../../hooks';
import { titleCase } from '../../utils';


export function QuizDetails(): JSX.Element {// NOSONAR
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
                // Todo: Quiz ID was not found in our localState try to fetch from server
                console.error(`Could not find quiz with id ${currentFile}`);
            }
        }
        // if the currentFile is empty, set the currentFileDetails to null
        if (isMounted && currentFile === '') {
            setCurrentFileDetails(null);
        }
    }, [isMounted, currentFile]);

    return currentFileDetails ? (
        <section className={'p-2'}>
            <header>
                <h1 className={'text-3xl sm:text-4xl font-bold flex w-full'}>
                    {titleCase(currentFileDetails.name)}
                </h1>
            </header>
            <pre className={'text-xs sm:text-sm'}>
                {JSON.stringify(currentFileDetails, null, 2)}
            </pre>

        </section>
    ) : (
        <p className={'text-gray-300 text-center text-base'}>
            Select a quiz to view its details
        </p>
    )
}

export default QuizDetails
