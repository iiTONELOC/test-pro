import { TopicTag } from '..';
import { JSX } from 'preact/jsx-runtime';
import { TopicModelType } from '../../utils/api';
import { useCurrentFileSignal } from '../../signals';
import { titleCase, trimClasses, uuid } from '../../utils';

const h1Classes = 'text-3xl md:text-4xl mt-8 lg:mt-0 font-bold lg:text-center text-gray-200';

export function QuizDetailHeader(): JSX.Element {// NOSONAR
    const { fileDetails } = useCurrentFileSignal();
    const currentFileDetails = fileDetails.value;
    const headerClasses = 'w-full flex flex-col justify-start items-start lg:items-center gap-4 h-auto';

    const topicContainerClasses = `w-full flex flex-wrap flex-row  place-content-start lg:place-content-center gap-3 my-6 lg:m-6 `;

    return currentFileDetails ? (
        <header className={headerClasses}>
            <h1 className={h1Classes}>
                {titleCase(currentFileDetails.name)} {'Details'}
            </h1>


            <div className={trimClasses(topicContainerClasses)}>
                {/* TODO: create an add topic ability if the quiz has no topics */}
                {[...currentFileDetails.topics as TopicModelType[]]
                    .map(topic => (
                        <TopicTag key={uuid()} topic={topic.name} />
                    ))}
            </div>
        </header>
    ) : <></>
}

export default QuizDetailHeader;
