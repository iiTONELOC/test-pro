import { TopicTag } from '..';
import { JSX } from 'preact/jsx-runtime';
import { TopicModelType } from '../../utils/api';
import { useCurrentFileSignal } from '../../signals';
import { titleCase, trimClasses, uuid } from '../../utils';

const h1Classes = 'text-3xl md:text-4xl mt-8 lg:mt-0 font-bold lg:text-center';

export interface QuizDetailHeaderProps {
    isHistory?: boolean;
}

export function QuizDetailHeader({ isHistory }: Readonly<QuizDetailHeaderProps>): JSX.Element {// NOSONAR
    const { fileDetails } = useCurrentFileSignal();
    const currentFileDetails = fileDetails.value;
    const headerClasses = isHistory ?
        'w-full flex flex-col justify-center items-center mt-1 gap-3 mb-6' :
        'w-[415px] sm:w-[550px] md:w-[675px] lg:w-[920px] xl:w-[1100px] mt-1';

    const topicContainerClasses = `${isHistory ? 'max-w-sm sm:max-w-md md:max-w-lg lg:max-w-3xl xl:max-w-4xl px-2' : 'w-max-w-screen-lg'}
    flex flex-wrap flex-row place-content-center gap-3 my-6 lg:m-6 `;

    return currentFileDetails ? (
        <header className={headerClasses}>
            <h1 className={h1Classes}>
                {titleCase(currentFileDetails.name)} {isHistory ? 'History' : 'Details'}
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
