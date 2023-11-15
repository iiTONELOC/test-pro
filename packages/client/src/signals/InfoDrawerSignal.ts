import { signal, Signal } from '@preact/signals';

const isDrawerOpen = signal(true);


export type InfoDrawerSignal = {
    isDrawerOpen: Signal<boolean>;
    toggleDrawer: () => void;
};

export const useInfoDrawerSignal = (): InfoDrawerSignal => {
    const toggleDrawer = () => {
        isDrawerOpen.value = !isDrawerOpen.value
    };
    return { isDrawerOpen, toggleDrawer };
};
