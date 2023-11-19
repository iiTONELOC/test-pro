import { signal, Signal } from '@preact/signals';

const inViewAttempt = signal<boolean>(true);

export type InViewAttemptSignal = {
    inViewAttempt: Signal<boolean>;
    setInViewAttempt: (value: boolean) => void;
};

export const useInViewAttemptSignal = (): InViewAttemptSignal => {
    return {
        inViewAttempt,
        setInViewAttempt: (value: boolean) => inViewAttempt.value = value
    };
}
