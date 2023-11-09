import { signal } from '@preact/signals';

const isDrawerOpen = signal(true);

export const useInfoDrawerState = () => {
    const toggleDrawer = () => {
        console.log('toggleDrawer');
        isDrawerOpen.value = !isDrawerOpen.value
    };
    return { isDrawerOpen, toggleDrawer };
};
