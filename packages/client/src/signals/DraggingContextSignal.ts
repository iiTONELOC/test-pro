import { signal, Signal } from '@preact/signals';

const isDraggingSignal = signal<boolean>(false);

export type DraggingContextSignal = {
    isDragging: Signal<boolean>;
};

export const useDraggingContextSignal = (): DraggingContextSignal => {

    return { isDragging: isDraggingSignal };
};
