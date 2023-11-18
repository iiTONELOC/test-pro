import { JSX } from 'preact/jsx-runtime';
import QuizMetaData from './QuizMetaData';
import { useMountedState, useShowQuizDetails } from '../../../hooks';
import { QuizDetailHeader } from '../QuizDetailHeader';

const sectionClasses = 'w-full min-w-max p-2 flex flex-col justify-start items-start lg:items-center gap-4 h-full min-h-[calc(100vh-150px)]';

export function QuizInfoHeader(): JSX.Element {// NOSONAR
    const isMounted = useMountedState();

    return isMounted ? (
        <section className={sectionClasses}>
            <QuizDetailHeader />
            <QuizMetaData />
        </section>
    ) : <></>
}

export default QuizInfoHeader;
