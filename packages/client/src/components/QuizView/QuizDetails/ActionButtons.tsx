import { QuizViews, useQuizViewSignal, useInfoDrawerSignal } from '../../../signals';
import { trimClasses, uuid } from '../../../utils';

const divClasses = ' min-w-max flex flex-row p-3 gap-4 place-content-center';
const buttonClasses = `w-full bg-slate-950 text-gray-400/[.9] text-sm font-semibold p-3 rounded-md hover:cursor-pointer
hover:bg-emerald-900 hover:text-gray-300 hover:scale-110 hover:shadow-xl transition-all min-w-max max-w-[200px]
hover:border-1 hover:border-black text-base`;

export function ActionButtons(): JSX.Element {
    const { setCurrentQuizView } = useQuizViewSignal();
    const { isDrawerOpen, toggleDrawer } = useInfoDrawerSignal();

    const quizActions = [
        {
            name: 'Take Quiz',
            action: () => {
                console.log('Take Quiz');
                setCurrentQuizView(QuizViews.Quiz);
                isDrawerOpen && toggleDrawer();
            }
        },
        {
            name: 'View Quiz History',
            action: () => {
                console.log('View Quiz History');
                setCurrentQuizView(QuizViews.QuizHistory);
            }
        },
        {
            name: 'View Quiz Options',
            action: () => {
                console.log('View Quiz Options');
                setCurrentQuizView(QuizViews.QuizEdit);
            }
        }
    ];

    return (
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
    );
}
