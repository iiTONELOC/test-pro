import { createRef, RefObject } from 'preact';
import { useEffect } from 'preact/hooks';

export type ToolTipOnFocusProps = {
    groupContainerRef: RefObject<HTMLDivElement>;
}

export function useToolTipsOnFocus({ groupContainerRef }: ToolTipOnFocusProps): void { //NOSONAR
    let timeout: NodeJS.Timeout | null = null;
    const hiddenElementRef = createRef<HTMLDivElement>();

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

    // watches the groupContainerRef for focusin and focusout events
    // if the focusin event is triggered, it looks for a div with the hidden class amongst the children
    // sets this to the hiddenElementRef and removes the hidden class
    // if the focusout event is triggered, it checks if the hiddenElementRef has the block class
    // if it does, it removes the block class and adds the hidden class to remove the tooltip
    useEffect(() => {
        groupContainerRef.current?.addEventListener('focusin', handleFocus);
        groupContainerRef.current?.addEventListener('focusout', handleFocusOut);
        groupContainerRef.current?.addEventListener('mouseout', handleFocusOut);

        return () => {
            groupContainerRef.current?.removeEventListener('focusin', handleFocus);
            groupContainerRef.current?.removeEventListener('focusout', handleFocusOut);
            groupContainerRef.current?.removeEventListener('mouseout', handleFocusOut);
        }
    }, [groupContainerRef]);
}
