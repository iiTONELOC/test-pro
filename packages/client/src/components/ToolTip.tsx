import { createRef } from 'preact';
import { useEffect } from 'preact/hooks';
import { trimClasses, uuid } from '../utils';

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
    tipPosition: 'top' | 'bottom' | 'left' | 'right'; //NOSONAR
    offset?: number;
}

const groupContainerClasses = 'relative group';

const tooltipClasses = `absolute hidden group-hover:block group-focus:block bg-black/[.85] rounded-md
text-xs px-2 py-1 min-w-max max-w-xs border border-gray-700 z-50`;

export function ToolTip(props: ToolTipProps): JSX.Element { //NOSONAR
    const { children, toolTipText, tipPosition, offset } = props;
    const groupContainerRef = createRef<HTMLDivElement>();
    const hiddenElementRef = createRef<HTMLDivElement>();

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

    useEffect(() => {
        let timeout: NodeJS.Timeout | null = null;
        // check to see if the div contains an element that is focused
        // if it does then show the tooltip by removing the hidden class
        const handleFocus = () => {
            if (groupContainerRef.current?.contains(document.activeElement)) {
                // look for a div with the hidden class amongst the children set this to the hiddenElementRef and remove the hidden class
                const children = groupContainerRef.current?.children;
                if (children) {
                    for (const child of children) {
                        handleFocusIn(child as HTMLDivElement);
                    }
                }
            }
        };

        const handleFocusIn = (element: HTMLDivElement) => {
            if (element instanceof HTMLDivElement && element.classList.contains('hidden')) {
                hiddenElementRef.current = element;
                hiddenElementRef.current.classList.remove('hidden');
                hiddenElementRef.current.classList.add('block');

                // set a timeout to remove a tooltip triggered by focused element and not a hover after 5.5 seconds
                timeout = setTimeout(() => {
                    if (hiddenElementRef.current) {
                        hiddenElementRef.current.classList.remove('block');
                        hiddenElementRef.current.classList.add('hidden');
                    }
                }, 5500);
            }
        }

        const handleFocusOut = () => {
            if (hiddenElementRef.current && hiddenElementRef?.current.classList.contains('block')) {
                timeout !== null && (() => {
                    clearTimeout(timeout);
                    timeout = null;
                })();
                hiddenElementRef.current.classList.remove('block');
                hiddenElementRef.current.classList.add('hidden');
            }
        };

        //  for focus events on the group container and handle them
        groupContainerRef.current?.addEventListener('focusin', handleFocus);
        groupContainerRef.current?.addEventListener('focusout', handleFocusOut);

        return () => {
            groupContainerRef.current?.removeEventListener('focusin', handleFocus);
            groupContainerRef.current?.removeEventListener('focusout', handleFocusOut);
        }
    }, [groupContainerRef]);

    return (
        <div
            ref={groupContainerRef}
            className={groupContainerClasses}>
            {children}
            <div
                className={trimClasses(tooltipClasses) + ' ' + tipClasses}>
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
