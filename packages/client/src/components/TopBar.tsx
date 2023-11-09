import { InfoDrawerToggler } from './InfoDrawerToggler';
import { useInfoDrawerState } from '../signals';
import { Folder, Search } from '../assets/icons';
import { ActionBarIconProps } from './ActionBar';
import { trimClasses } from '../utils';
import { ToolTip } from './ToolTip';


function TopBarIcon({ Icon, title, action }: ActionBarIconProps) {
    const buttonClasses = `w-10 h-10 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-200`;
    const iconClasses = 'w-5 h-5 mb-1';

    return (
        <ToolTip
            toolTipText={title}
            tipPosition='bottom'
        >
            <button className={trimClasses(buttonClasses)} onClick={action}>
                <Icon className={iconClasses} />
            </button>
        </ToolTip>
    )
}

export function TopBar(): JSX.Element {
    const { isDrawerOpen } = useInfoDrawerState();
    const icons = [
        {
            Icon: Folder,
            title: 'View Quizzes',
            action: () => console.log('View Quizzes')
        },
        {
            Icon: Search,
            title: 'Search for a quiz. Use # to include topics',
            action: () => console.log('Search Quizzes')
        },
        {
            Icon: InfoDrawerToggler,
            title: `${isDrawerOpen.value ? 'Close' : 'Open'} Info Drawer`,
            action: () => console.log('Toggle Info Drawer')
        }
    ];

    return (
        <header className={'bg-gray-900 h-8 w-screen fixed top-0 z-10'}>
            <div className={'ml-12 w-60 h-8 grid grid-cols-4 gap-2 '}>
                {icons.map((icon, index) => <TopBarIcon key={index} {...icon} />)}
            </div>
        </header>
    )
}
