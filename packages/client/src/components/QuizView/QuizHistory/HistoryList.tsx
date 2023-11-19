import { ToolTip } from '../../ToolTip';
import { JSX } from 'preact/jsx-runtime';
import { useEffect, useState } from 'preact/hooks';
import { HistoryListItem } from './HistoryListItem';
import { PopulatedQuizHistoryType } from '../../../utils/api';
import { keyHandler, uuid, clickHandler } from '../../../utils';

export interface HistoryListProps {
    history: PopulatedQuizHistoryType[],
    setViewAttempt: (attempt: PopulatedQuizHistoryType) => void
}

export function HistoryList({ history, setViewAttempt }: HistoryListProps): JSX.Element { // NOSONAR
    const [selectedIndex, setSelectedIndex] = useState(0);

    const autoFocus = () => {
        const selector: NodeListOf<HTMLElement> = document.querySelectorAll('li > button');
        selector.length > 0 && selector[selectedIndex].focus();
    };

    const setAttempt = () => setViewAttempt(history[selectedIndex]);

    const handleClick = (event: MouseEvent) => clickHandler({
        event,
        callback: setAttempt,
        stopPropagation: true
    });

    const handleArrowKeys = () => {
        if (selectedIndex < history.length - 1) {
            setSelectedIndex(selectedIndex + 1);
        } else {
            setSelectedIndex(0);
        }
    };

    const handleEnterKey = (e: KeyboardEvent) => keyHandler({
        event: e,
        keyToWatch: 'Enter',
        callback: setAttempt,
        stopPropagation: true
    });


    const arrowDownKeyListener = (e: KeyboardEvent) => keyHandler({
        event: e,
        keyToWatch: 'ArrowDown',
        callback: handleArrowKeys,
        stopPropagation: true
    });


    const arrowUpKeyListener = (e: KeyboardEvent) => keyHandler({
        event: e,
        keyToWatch: 'ArrowUp',
        callback: handleArrowKeys,
        stopPropagation: false
    });

    const handlers = (e: KeyboardEvent) => {
        arrowDownKeyListener(e);
        arrowUpKeyListener(e);
        handleEnterKey(e);
    };

    useEffect(() => autoFocus(), [history, selectedIndex]);


    return history.length > 0 ? (
        <ul className={'rounded-md w-full min-h-min max-h-[70vh] overflow-y-auto flex flex-col gap-3 '}>
            {history.map(historyItem => (
                <ToolTip key={uuid()} toolTipText='View Quiz Attempt'>
                    <li onKeyDown={handlers} onClick={handleClick}>
                        <HistoryListItem history={historyItem} />
                    </li>
                </ToolTip>
            ))}
        </ul>
    ) : <p>Take the Quiz to see your history!</p>
}
