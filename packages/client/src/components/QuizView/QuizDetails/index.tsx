import { JSX } from 'preact/jsx-runtime';
import QuizInfoHeader from './QuizInfoHeader';
import { ActionButtons } from './ActionButtons';
import { useMountedState, useShowQuizDetails } from '../../../hooks';


const notSelectedClasses = 'text-gray-300 text-center text-base';
const divContainerClasses = 'h-full min-h-[calc(100vh-10vh)] flex-col justify-start justify-between';


export function QuizDetails(): JSX.Element {// NOSONAR
    const isMounted: boolean = useMountedState();
    const showQuizDetails = useShowQuizDetails();

    return isMounted && showQuizDetails ? (
        <div className={divContainerClasses}>
            <QuizInfoHeader />
            <ActionButtons />
        </div>
    ) : (
        <p className={notSelectedClasses}>
            Select a quiz to view its details
        </p>
    )
}

export default QuizDetails
