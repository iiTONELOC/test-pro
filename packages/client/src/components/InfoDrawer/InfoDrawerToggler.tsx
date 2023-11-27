import { JSX } from 'preact/jsx-runtime';
import { useInfoDrawerSignal } from '../../signals';
import { clickHandler, keyHandler } from '../../utils';
import { Folder, FolderOpen } from '../../assets/icons';

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
            {!isDrawerOpen.value && <Folder className={iconClasses} />}
            {isDrawerOpen.value && <FolderOpen className={iconClasses} />}
        </span>
    )
}
