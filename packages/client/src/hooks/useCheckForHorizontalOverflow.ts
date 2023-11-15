import { useSelectedFileSignal, SelectedFileSignal, useInfoDrawerSignal, InfoDrawerSignal } from '../signals';
import { useEffect, useState } from 'preact/hooks';
import { RefObject } from 'preact';

export type useCheckForHorizontalOverflowProps = {
    containerRef: RefObject<HTMLElement | undefined>;
}

export interface IUseCheckForHorizontalOverflow {
    hasOverflow: boolean
}

export function useCheckForHorizontalOverflow({ containerRef }: useCheckForHorizontalOverflowProps): IUseCheckForHorizontalOverflow {
    const [isOverflowing, setIsOverflowing] = useState<boolean>(false);
    const { selectedFile }: SelectedFileSignal = useSelectedFileSignal();
    const { isDrawerOpen }: InfoDrawerSignal = useInfoDrawerSignal();
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
    }, [isDrawerOpen.value, currentFile, container]);

    return { hasOverflow: isOverflowing };
}
