
import { JSX } from 'preact/jsx-runtime';
import { ToolTip } from '../../ToolTip';
import { useEffect } from 'preact/hooks';
import { PopulatedQuizHistoryType } from '../../../utils/api';
import { calculateScore, dateTime, keyHandler, trimClasses, uuid, displayElapsedTime } from '../../../utils';


const buttonClasses = `bg-slate-800 w-full hover:cursor-pointer hover:bg-slate-700 p-3 flex flex-wrap flex-row gap-2 justify-between
items-center rounded-md text-gray-300 ease-in-out-300 transition-all focus:bg-slate-600 focus:border-2 focus:border-purple-500 focus:outline-none`;


function HistoryItem({ history }: { history: PopulatedQuizHistoryType }): JSX.Element {
    const taken = dateTime(history.attempt.dateTaken);
    const passed = history.attempt.passed ? 'Passed' : 'Failed';
    const score = calculateScore(history.attempt.earnedPoints, history.attempt.answeredQuestions.length);

    const textBase = 'text-base';
    return (
        <button tabIndex={0} className={trimClasses(buttonClasses)}>
            <p className={textBase}>{taken}</p>
            <span className={'flex flex-wrap flex-row gap-2 items-center  '}>
                <p className={'text-md'}> Result: {passed}</p>
                <p className={'text-md'}> Score: {score}%</p>
                <p className={'text-md'}> Time: {displayElapsedTime(history.attempt.elapsedTimeInMs)}</p>
            </span>
        </button >
    )
}

export interface HistoryListProps {
    history: PopulatedQuizHistoryType[],
    handleIndexChange: {
        selectedIndex: number,
        setSelectedIndex: (index: number) => void
    }
}

export function HistoryList({ history, handleIndexChange }: HistoryListProps): JSX.Element {
    const { selectedIndex, setSelectedIndex } = handleIndexChange;


    const autoFocus = () => {
        const selector: NodeListOf<HTMLElement> = document.querySelectorAll('li > button');
        if (selector.length > 0) {
            selector[selectedIndex].focus();
        }
    };

    useEffect(() => {
        autoFocus();
    }, [history, selectedIndex]);

    const handleArrowKeys = () => {
        if (selectedIndex < history.length - 1) {
            setSelectedIndex(selectedIndex + 1);
        } else {
            setSelectedIndex(0);
        }
    }


    const arrowDownKeyListener = (e: KeyboardEvent) => {
        keyHandler({
            event: e,
            keyToWatch: 'ArrowDown',
            callback: handleArrowKeys,
            stopPropagation: true
        });
    }

    const arrowUpKeyListener = (e: KeyboardEvent) => {
        keyHandler({
            event: e,
            keyToWatch: 'ArrowUp',
            callback: handleArrowKeys,
            stopPropagation: false
        });
    }

    const handlers = (e: KeyboardEvent) => {
        arrowDownKeyListener(e);
        arrowUpKeyListener(e);
    }


    return history.length > 0 ? (
        // TODO: ADD Button Handlers to scroll through the list with the arrow keys
        <ul className={'rounded-md w-full min-h-min max-h-[70vh] overflow-y-auto flex flex-col gap-3 '}>
            {history.map(historyItem => (
                <ToolTip key={uuid()} toolTipText='View Quiz Attempt'>
                    <li onKeyDown={handlers}>
                        <HistoryItem history={historyItem} />
                    </li>
                </ToolTip>
            ))}
        </ul>
    ) : <p>Take the Quiz to see your history!</p>
}
