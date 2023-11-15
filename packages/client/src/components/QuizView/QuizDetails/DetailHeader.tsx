import { TopicTag } from '../..';
import { titleCase, uuid } from '../../../utils';
import { QuizModelResponse, TopicModelType } from '../../../utils/api';

const h1Classes = 'text-4xl mt-8 lg:mt-0 font-bold lg:text-center';
const topicContainerClasses = 'w-min-max flex flex-wrap flex-row gap-3  my-6 lg:m-6';

export function DetailHeader({ currentFileDetails }: { currentFileDetails: QuizModelResponse }): JSX.Element {// NOSONAR
    return currentFileDetails ? (
        <header>
            <h1 className={h1Classes}>
                {titleCase(currentFileDetails.name)}
            </h1>

            <div className={topicContainerClasses}>
                {[...currentFileDetails.topics as TopicModelType[]]
                    .map(topic => (
                        <TopicTag key={uuid()} topic={topic.name} />
                    ))}
            </div>
        </header>
    ) : <></>
}

export default DetailHeader;
