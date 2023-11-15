import { useSelectedFileSignal, SelectedFileSignal, useQuizzesDbSignal, QuizzesDbSignal } from '../../../signals';
import { QuizModelResponse, TopicModelType } from '../../../utils/api';
import { useEffect, useState } from 'preact/hooks';
import { useMountedState } from '../../../hooks';
import { ActionButtons } from './ActionButtons';
import { titleCase, uuid } from '../../../utils';
import QuizMetaData from './QuizMetaData';
import { TopicTag } from '../..';

export function QuizDetails(): JSX.Element {// NOSONAR
    const [currentFileDetails, setCurrentFileDetails] = useState<QuizModelResponse | null>(null);
    const { selectedFile }: SelectedFileSignal = useSelectedFileSignal();
    const { quizzesDb }: QuizzesDbSignal = useQuizzesDbSignal();
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
        <div className={'h-full min-h-[calc(100vh-10vh)] flex-col justify-start justify-between '}>
            <section className={'w-full min-w-max p-2 flex flex-col justify-start items-start lg:items-center gap-4 h-full min-h-[calc(100vh-150px)]'}>
                <header>
                    <h1 className={'text-4xl font-bold lg:text-center'}>
                        {titleCase(currentFileDetails.name)}
                    </h1>
                    <div className={'flex flex-wrap flex-row gap-2 mt-2'}>
                        {[...currentFileDetails.topics as TopicModelType[]].map(topic =>
                            <TopicTag key={uuid()} topic={topic.name} />)}
                    </div>
                </header>

                <div className={'w-full flex flex-col  gap-2 w-full items-start lg:items-center'}>
                    <QuizMetaData currentFileDetails={currentFileDetails} />
                </div>
            </section>

            <ActionButtons />
        </div>

    ) : (
        <p className={'text-gray-300 text-center text-base'}>
            Select a quiz to view its details
        </p>
    )
}

export default QuizDetails
