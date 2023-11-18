import { JSX } from 'preact/jsx-runtime';
import { useInfoDrawerSignal } from '../../signals';
import { clickHandler, keyHandler } from '../../utils';
import { Columns, WindowIcon } from '../../assets/icons';

export function InfoDrawerToggler(): JSX.Element {
    const { isDrawerOpen, toggleDrawer } = useInfoDrawerSignal();
    const iconClasses = 'w-5 h-5 mb-1';

    const handleCLick = (event: MouseEvent) => {
        clickHandler({ event, callback: toggleDrawer, stopPropagation: true })
    };

    const handleKeyDown = (event: KeyboardEvent) => {
        keyHandler({ event, keyToWatch: 'Enter', direction: 'down', callback: toggleDrawer, stopPropagation: true })
    };

    return (
        <span
            onClick={handleCLick}
            onKeyDown={handleKeyDown}
        >
            {!isDrawerOpen.value && <Columns className={iconClasses} />}
            {isDrawerOpen.value && <WindowIcon className={iconClasses} />}
        </span>
    )
}
