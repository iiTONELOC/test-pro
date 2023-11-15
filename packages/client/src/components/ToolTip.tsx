import { createRef } from 'preact';
import { trimClasses, uuid } from '../utils';
import { useToolTipsOnFocus } from '../hooks';


/**
 * ```ts
 * export type ToolTipProps = {
 *    children: JSX.Element | JSX.Element[];
 *    toolTipText: string;
 *    tipPosition: 'top' | 'bottom' | 'left' | 'right'; //NOSONAR
 *    offset?: number;
 * }
 * ```
 */
export type ToolTipProps = {
    children: JSX.Element | JSX.Element[];
    toolTipText: string;
}

const groupContainerClasses = 'group';

const tooltipClasses = `absolute hidden group-hover:block group-focus:block bg-black/[.85] rounded-md
text-xs px-2 py-1 min-w-max max-w-xs border border-gray-700 z-50 m-2`;

export function ToolTip(props: ToolTipProps): JSX.Element { //NOSONAR
    const { children, toolTipText } = props;
    const groupContainerRef = createRef<HTMLDivElement>();


    const title = toolTipText;

    useToolTipsOnFocus({ groupContainerRef });

    return (
        <div
            ref={groupContainerRef}
            className={groupContainerClasses}>
            {children}

            <div
                className={trimClasses(tooltipClasses)}
            >
                <ul>
                    <pre>
                        {title.split('\n').map((line: string) => (
                            <li key={uuid()}>
                                <p className={''}>{line}</p>
                            </li>
                        ))}
                    </pre>
                </ul>
            </div>
        </div>
    )
}
