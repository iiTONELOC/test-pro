import { JSX } from 'preact/jsx-runtime';
import { trimClasses, uuid } from '../../../utils';
import { QuizViews, useQuizViewSignal, useInfoDrawerSignal } from '../../../signals';

const divClasses = ' w-full flex flex-wrap flex-row p-3 gap-4 place-content-center bg-slate-900';
const buttonClasses = `w-full bg-slate-950 text-gray-400/[.9] text-xs md:text-sm font-semibold p-3 rounded-md hover:cursor-pointer
hover:bg-green-700 hover:text-gray-200 hover:scale-110 hover:shadow-xl transition-all min-w-max max-w-[200px]
hover:border-1 hover:border-black text-base`;

export function ActionButtons({ toggleHistory, showHistory }: { toggleHistory: () => void, showHistory: boolean }): JSX.Element { // NOSONAR
    const { setCurrentQuizView, currentQuizView } = useQuizViewSignal();
    const { isDrawerOpen, toggleDrawer } = useInfoDrawerSignal();

    const quizActions = [
        {
            name: showHistory ? 'Retake Quiz' : 'Take Quiz',
            action: () => {
                setCurrentQuizView(QuizViews.Quiz);
                isDrawerOpen.value && toggleDrawer();
            }
        },
        {
            name: showHistory ? 'Hide Quiz History' : 'View Quiz History',
            action: () => {
                toggleHistory();
            }
        },
        {
            name: 'View Quiz Options',
            action: () => {
                setCurrentQuizView(QuizViews.QuizEdit);
            }
        }
    ];

    return currentQuizView.value === QuizViews.QuizDetails || currentQuizView.value === QuizViews.QuizHistory ? (
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
