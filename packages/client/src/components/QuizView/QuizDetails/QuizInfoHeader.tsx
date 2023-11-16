import { useShowQuizDetails } from '../../../hooks';
import QuizMetaData from './QuizMetaData';
import DetailHeader from './DetailHeader';

const sectionClasses = 'w-full min-w-max p-2 flex flex-col justify-start items-start lg:items-center gap-4 h-full min-h-[calc(100vh-150px)]';

export function QuizInfoHeader(): JSX.Element {// NOSONAR
    const showQuizDetails = useShowQuizDetails();

    return showQuizDetails ? (
        <section className={sectionClasses}>
            <DetailHeader />
            <QuizMetaData />
        </section>
    ) : <></>
}

export default QuizInfoHeader;
