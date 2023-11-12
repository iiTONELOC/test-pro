import { signal, Signal } from '@preact/signals';

const isDrawerOpen = signal(true);


export type InfoDrawerState = {
    isDrawerOpen: Signal<boolean>;
    toggleDrawer: () => void;
};

export const useInfoDrawerState = (): InfoDrawerState => {
    const toggleDrawer = () => {
        isDrawerOpen.value = !isDrawerOpen.value
    };
    return { isDrawerOpen, toggleDrawer };
};
