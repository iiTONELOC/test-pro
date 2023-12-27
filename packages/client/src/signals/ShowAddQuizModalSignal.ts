import { signal, Signal } from '@preact/signals';

const ModalSignal = signal<boolean>(false);

export type ShowAddQuizModalSignal = {
    showAddQuizModalSignal: Signal<boolean>;
}

export function useShowAddQuizModalSignal(): ShowAddQuizModalSignal {
    return {
        showAddQuizModalSignal: ModalSignal
    }
}
