import { clickHandler, trimClasses, uuid } from '../utils';
import { InfoDrawerToggler } from './InfoDrawer';
import { useInfoDrawerState } from '../signals';
import { Folder, Search } from '../assets/icons';
import { ActionBarIconProps } from './ActionBar';

import { ToolTip } from './ToolTip';

const buttonClasses = `w-10 h-10 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-200 z-50`;
const iconClasses = 'w-5 h-5 mb-1';

function TopBarIcon({ Icon, title, action, id }: Readonly<ActionBarIconProps>) {

    const handleClick = (event: MouseEvent) => {
        clickHandler({
            event,
            callback: () => {
                action();
                const target = event.target as HTMLButtonElement;
                // the button is re-rendered when the drawer is toggled
                // so wait for a bit and re-focus the button
                target?.id !== 'search-quizzes' && (
                    setTimeout(() => {
                        const clickedButton = document.getElementById(target?.id);
                        clickedButton?.focus();
                    }, 35));
            },
            stopPropagation: true
        })
    };

    return (
        <ToolTip
            toolTipText={title}
            tipPosition='bottom'
        >
            <button
                className={trimClasses(buttonClasses)}
                onClick={handleClick}
                id={id}
            >
                <Icon className={iconClasses} />
            </button>
        </ToolTip>
    )
}

export function TopBar(): JSX.Element {
    const { isDrawerOpen, toggleDrawer } = useInfoDrawerState();

    const setOpen = () => {
        if (!isDrawerOpen.value) {
            toggleDrawer();
        }
    };

    const icons = [
        {
            Icon: Folder,
            title: 'View Quizzes',
            action: setOpen,
            id: 'view-quizzes'
        },
        {
            Icon: Search,
            title: 'Search for a quiz. Use # to include topics',
            action: () => console.log('Search Quizzes'),
            id: 'search-quizzes'
        },
        {
            Icon: InfoDrawerToggler,
            title: `${isDrawerOpen.value ? 'Close' : 'Open'} Info Drawer`,
            action: toggleDrawer,
            id: 'info-drawer-toggler'
        }
    ];

    return (
        <header className={'bg-gray-900 h-8 w-screen fixed top-0 z-20'}>
            <div className={'ml-12 w-60 h-8 grid grid-cols-4 gap-2'}>
                {icons.map(icon => <TopBarIcon key={uuid()} {...icon} />)}
            </div>
        </header>
    )
}
