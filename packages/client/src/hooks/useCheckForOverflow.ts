import { useSelectedFileState, SelectedFileState, useInfoDrawerState, InfoDrawerState } from '../signals';
import { useEffect, useState } from 'preact/hooks';
import { RefObject } from 'preact';

export type UseCheckForOverflowProps = {
    containerRef: RefObject<HTMLElement | undefined>
}

export interface IUserCheckForOverflow {
    hasOverflow: boolean
}

export function useCheckForOverflow({ containerRef }: UseCheckForOverflowProps): IUserCheckForOverflow {
    const [isOverflowing, setIsOverflowing] = useState<boolean>(false);
    const { selectedFile }: SelectedFileState = useSelectedFileState();

    const currentFile = selectedFile.value;
    const container = containerRef.current;

    const checkForOverflow = () => {
        if (container) {
            const overflowing = container.scrollWidth > container.clientWidth;
            setIsOverflowing(overflowing);
        }
    };

    const checkForOverflowAndSetListener = () => {
        if (currentFile !== '') {
            checkForOverflow();
            window?.addEventListener('resize', checkForOverflow);
        }
    }

    const cleanUpListener = () => window?.removeEventListener('resize', checkForOverflow);

    // ensures that any child components have been rendered before checking for overflow
    const handleEffect = () => setTimeout(() => {
        checkForOverflowAndSetListener();
    }, 150);


    useEffect(() => {
        handleEffect();
        return cleanUpListener;
    }, [currentFile]);

    return { hasOverflow: isOverflowing };
}
