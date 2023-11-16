import { useShowQuizDetails } from '../../../hooks';
import { trimClasses, uuid } from '../../../utils';
import { QuizViews, useQuizViewSignal, useInfoDrawerSignal } from '../../../signals';

const divClasses = ' min-w-max flex flex-row p-3 gap-4 place-content-center';
const buttonClasses = `w-full bg-slate-950 text-gray-400/[.9] text-sm font-semibold p-3 rounded-md hover:cursor-pointer
hover:bg-emerald-900 hover:text-gray-300 hover:scale-110 hover:shadow-xl transition-all min-w-max max-w-[200px]
hover:border-1 hover:border-black text-base`;

export function ActionButtons(): JSX.Element { // NOSONAR
    const hasDetails = useShowQuizDetails();
    const { setCurrentQuizView } = useQuizViewSignal();
    const { isDrawerOpen, toggleDrawer } = useInfoDrawerSignal();

    const quizActions = [
        {
            name: 'Take Quiz',
            action: () => {
                setCurrentQuizView(QuizViews.Quiz);
                isDrawerOpen.value && toggleDrawer();
            }
        },
        {
            name: 'View Quiz History',
            action: () => {
                setCurrentQuizView(QuizViews.QuizHistory);
            }
        },
        {
            name: 'View Quiz Options',
            action: () => {
                setCurrentQuizView(QuizViews.QuizEdit);
            }
        }
    ];

    return hasDetails ? (
        <div className={divClasses}>
            {quizActions.map(action => (
                <button
                    key={uuid()}
                    className={trimClasses(buttonClasses)}
                    onClick={action.action}>
                    {action.name}
                </button>
            ))}
        </div>
    ) : <></>
}
