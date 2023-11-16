import { useMountedState, useShowQuizDetails } from '../../../hooks';
import { ActionButtons } from './ActionButtons';
import QuizInfoHeader from './QuizInfoHeader';

const divContainerClasses = 'h-full min-h-[calc(100vh-10vh)] flex-col justify-start justify-between';
const notSelectedClasses = 'text-gray-300 text-center text-base';

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
