import { uuid } from '../../utils';
import { JSX } from 'preact/jsx-runtime';
import { TopBarIcon } from './TopBarIcon';
import { Search } from '../../assets/icons';

const headerClasses = 'bg-gray-900 h-8 w-screen fixed top-0 z-20';
const headerDivClasses = 'ml-12 w-60 h-8 grid grid-cols-4 gap-2';


export function TopBar(): JSX.Element {

    const icons = [
        {
            Icon: Search,
            title: 'Search for a quiz. Use # to include topics',
            action: () => console.log('Search Quizzes'),
            id: 'search-quizzes'
        }
    ];

    return (
        <header className={headerClasses}>
            <div className={headerDivClasses}>
                {icons.map(icon => <TopBarIcon key={uuid()} {...icon} />)}
            </div>
        </header>
    )
}
