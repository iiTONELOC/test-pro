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

    const setAttempt = (index: number) => setViewAttempt(history[index]);

    const handleClick = (event: MouseEvent, index: number) => {
        setSelectedIndex(index);
        clickHandler({
            event,
            callback: () => setAttempt(index),
            stopPropagation: true
        });

    };
    const handleArrowKeys = (e: KeyboardEvent) => {
        const index = e.key === 'ArrowDown' ? selectedIndex + 1 : selectedIndex - 1;
        const newIndex = index < 0 ? history.length - 1 : index > history.length - 1 ? 0 : index;
        setSelectedIndex(newIndex);
    };

    const handleEnterKey = (e: KeyboardEvent) => keyHandler({
        event: e,
        keyToWatch: 'Enter',
        callback: () => setAttempt(selectedIndex),
        stopPropagation: true
    });


    const arrowDownKeyListener = (e: KeyboardEvent) => keyHandler({
        event: e,
        keyToWatch: 'ArrowDown',
        callback: () => handleArrowKeys(e),
        stopPropagation: true
    });


    const arrowUpKeyListener = (e: KeyboardEvent) => keyHandler({
        event: e,
        keyToWatch: 'ArrowUp',
        callback: () => handleArrowKeys(e),
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
            {history.map((historyItem, index) => (
                <ToolTip key={uuid()} toolTipText='View Quiz Attempt'>
                    <li onKeyDown={handlers} onClick={(e) => handleClick(e, index)}>
                        <HistoryListItem history={historyItem} />
                    </li>
                </ToolTip>
            ))}
        </ul>
    ) : <p>Take the Quiz to see your history!</p>
}
