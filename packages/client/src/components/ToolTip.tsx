import { trimClasses } from '../utils';

export type ToolTipProps = {
    children: JSX.Element | JSX.Element[];
    toolTipText: string;
    tipPosition: 'top' | 'bottom' | 'left' | 'right'; //NOSONAR
}

const rightPositionClasses = 'left-10 top-1';
const leftPositionClasses = 'right-10 top-1';
const topPositionClasses = 'bottom-10 left-1';
const bottomPositionClasses = 'top-10 left-1';

const groupContainerClasses = 'relative group';
const positionClasses = {
    'right': rightPositionClasses,
    'left': leftPositionClasses,
    'top': topPositionClasses,
    'bottom': bottomPositionClasses
};

export function ToolTip(props: ToolTipProps): JSX.Element { //NOSONAR
    const tooltipClasses = `absolute hidden group-hover:block bg-black/[.85] rounded-md
    text-xs px-2 py-1 min-w-max max-w-xs border border-gray-700 z-10`;

    const { children, toolTipText, tipPosition } = props;
    const title = toolTipText;

    const tipClasses = (positionClasses[tipPosition] ?? rightPositionClasses)

    return (
        <div className={groupContainerClasses}>
            {children}
            <div className={trimClasses(tooltipClasses) + ' ' + tipClasses}>
                <p>{title}</p>
            </div>
        </div>
    )
}
