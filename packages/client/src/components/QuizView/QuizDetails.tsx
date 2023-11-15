import { useSelectedFileState, SelectedFileState, useQuizzesDbState, QuizzesDbState } from '../../signals';
import { useEffect, useState } from 'preact/hooks';
import { QuizModelResponse } from '../../utils/api';
import { useMountedState } from '../../hooks';
import { titleCase, dateTime } from '../../utils';



function MetaDetail({ title, value }: Readonly<{ title: string, value: any }>): JSX.Element {
    return (
        <div className={'flex flex-col gap-2 text-gray-300'}>
            <p>
                <span className={'font-bold'}>{title}</span>{' '}
                <span>{value}</span>
            </p>
        </div>
    )
}


// need a 70 to pass the quiz
// each question is worth 1 point so the passing score is number of questions * 70% rounded up
const calculatePassingScore = (questions: any[]): number => {
    const passingScore = Math.ceil(questions.length * 0.7);
    return passingScore;
}

function FileMetaDetails({ currentFileDetails }: Readonly<{ currentFileDetails: QuizModelResponse }>): JSX.Element {
    return (
        <>
            <MetaDetail title={'Created:'} value={dateTime(currentFileDetails.createdAt as Date)} />
            <MetaDetail title={'Last Modified:'} value={dateTime(currentFileDetails.updatedAt as Date)} />
            <MetaDetail title={'Number of Questions:'} value={currentFileDetails.questions.length} />
            <MetaDetail title={'Passing Score:'} value={`70%`} />
            <MetaDetail title={'Number of Correct Answers To Pass:'} value={`${calculatePassingScore(currentFileDetails.questions)}`} />
        </>
    )
}

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



    return currentFileDetails && isMounted ? (
        <section className={'w-full min-w-max p-2 flex flex-col justify-center gap-8 bg-red-900 h-full over'}>
            <header>
                <h1 className={'text-3xl sm:text-4xl font-bold text-left bg-black'}>
                    {titleCase(currentFileDetails.name)}
                </h1>
            </header>
            <div className={'w-full min-w-max h-full text-xs sm:text-sm flex'}>
                <div className={'w-5/6 flex flex-col gap-4'}>
                    <FileMetaDetails currentFileDetails={currentFileDetails} />
                </div>
            </div>
            <pre className={''}>
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
