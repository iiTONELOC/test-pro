import { JSX } from 'preact/jsx-runtime';
import QuizMetaData from './QuizMetaData';
import { useMountedState } from '../../../hooks';
import { QuizDetailHeader } from '../QuizDetailHeader';

const sectionClasses = 'w-full p-2 flex flex-col justify-start items-start lg:items-center gap-4 h-auto';

export function QuizInfoHeader({ showHistory }: { showHistory: boolean }): JSX.Element {// NOSONAR
    const isMounted = useMountedState();

    return isMounted ? (
        <section className={sectionClasses}>
            <QuizDetailHeader />
            {!showHistory && <QuizMetaData />}
        </section>
    ) : <></>
}

export default QuizInfoHeader;
