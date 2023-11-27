import { ToolTip } from '../ToolTip';
import { ActionBarIconProps } from '../ActionBar';
import { clickHandler, trimClasses } from '../../utils';

const buttonClasses = `w-10 h-10 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-200 z-50`;
const iconClasses = 'w-5 h-5 mb-1';

export function TopBarIcon({ Icon, title, action, id }: Readonly<ActionBarIconProps>) {

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
        <ToolTip toolTipText={title}>
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
