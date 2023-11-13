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
}

const groupContainerClasses = 'group';

const tooltipClasses = `absolute hidden group-hover:block group-focus:block bg-black/[.85] rounded-md
text-xs px-2 py-1 min-w-max max-w-xs border border-gray-700 z-50 m-2`;

export function ToolTip(props: ToolTipProps): JSX.Element { //NOSONAR
    const { children, toolTipText } = props;
    const groupContainerRef = createRef<HTMLDivElement>();
    const hiddenElementRef = createRef<HTMLDivElement>();

    const title = toolTipText;

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
        groupContainerRef.current?.addEventListener('mouseout', handleFocusOut);

        return () => {
            groupContainerRef.current?.removeEventListener('focusin', handleFocus);
            groupContainerRef.current?.removeEventListener('focusout', handleFocusOut);
            groupContainerRef.current?.removeEventListener('mouseout', handleFocusOut);
        }
    }, [groupContainerRef]);

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
