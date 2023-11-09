import { useInfoDrawerState } from '../signals';
import { Columns, WindowIcon } from '../assets/icons';


export function InfoDrawerToggler(): JSX.Element {
    const { isDrawerOpen, toggleDrawer } = useInfoDrawerState();
    const isOpen = isDrawerOpen.value;
    const iconClasses = 'w-5 h-5 mb-1';

    const handleCLick = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        toggleDrawer();
    };

    return (
        <span onClick={handleCLick}>
            {!isOpen && <Columns className={iconClasses} />}
            {isOpen && <WindowIcon className={iconClasses} />}
        </span>
    )
}
