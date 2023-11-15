import { DocumentPlus } from '../assets/icons';
import { trimClasses } from '../utils';
import { ToolTip } from './ToolTip';

const icons = [
    {
        Icon: DocumentPlus,
        title: 'Create a new quiz',
        action: () => console.log('Create a new quiz')
    }
];

export type ActionBarIconProps = {
    Icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element
    title: string
    action: () => void,
    id?: string  // NOSONAR
}

const buttonClasses = `w-full h-10 flex items-center justify-center hover:bg-gray-800
    rounded-md text-gray-400 hover:text-gray-200`;
const iconClasses = 'w-5 h-5 hover:w-6 hover:h-6 transition-all duration-200';

const actionBarAsideClasses = 'bg-gray-900 h-full w-12 fixed left-0 top-8 bottom-16 px-2 z-10';
const actionBarDivClasses = 'h-full w-full my-2';

function ActionBarIcon({ Icon, title, action }: ActionBarIconProps): JSX.Element { //NOSONAR
    return (
        <ToolTip toolTipText={title}>
            <button
                className={trimClasses(buttonClasses)} onClick={action}>
                <Icon className={iconClasses} />
            </button>
        </ToolTip>
    )
}

export function ActionBar(): JSX.Element {
    return (
        <aside className={actionBarAsideClasses}>
            <div className={actionBarDivClasses}>
                {icons.map(({ Icon, title, action }) => (
                    <ActionBarIcon
                        Icon={Icon}
                        title={title}
                        action={action}
                        key={title}
                    />
                ))}
            </div>
        </aside>
    )
}
