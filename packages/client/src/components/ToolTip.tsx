import { trimClasses, uuid } from '../utils';

export type ToolTipProps = {
    children: JSX.Element | JSX.Element[];
    toolTipText: string;
    tipPosition: 'top' | 'bottom' | 'left' | 'right'; //NOSONAR
    offset?: number;
}

const groupContainerClasses = 'relative group';

const tooltipClasses = `absolute hidden group-hover:block bg-black/[.85] rounded-md
text-xs px-2 py-1 min-w-max max-w-xs border border-gray-700 z-10`;

export function ToolTip(props: ToolTipProps): JSX.Element { //NOSONAR
    const { children, toolTipText, tipPosition, offset } = props;
    const title = toolTipText;
    const defaultOffset = 10;

    const rightPositionClasses = `left-${offset ?? defaultOffset} top-1`;
    const leftPositionClasses = `right-${offset ?? defaultOffset} top-1`;
    const topPositionClasses = `bottom-${offset ?? defaultOffset} left-1`;
    const bottomPositionClasses = `top-${offset ?? defaultOffset} left-1`;

    const positionClasses = {
        'right': rightPositionClasses,
        'left': leftPositionClasses,
        'top': topPositionClasses,
        'bottom': bottomPositionClasses
    };

    const tipClasses = (positionClasses[tipPosition] ?? rightPositionClasses)

    return (
        <div className={groupContainerClasses}>
            {children}
            <div className={trimClasses(tooltipClasses) + ' ' + tipClasses}>
                <ul>
                    {title.split('\n').map((line: string, index: number) => (
                        <li key={uuid()}>
                            <p className={index > 0 ? 'ml-2' : ''}>{line}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
