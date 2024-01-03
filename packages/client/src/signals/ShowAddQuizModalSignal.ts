import { signal, Signal } from '@preact/signals';

const ModalSignal = signal<boolean>(false);
const AddQuizToFolderNameSignal = signal<string>('__root__');

export type ShowAddQuizModalSignal = {
    showAddQuizModalSignal: Signal<boolean>;
    addQuizToFolderNameSignal: Signal<string>;
}

export function useShowAddQuizModalSignal(): ShowAddQuizModalSignal {
    return {
        showAddQuizModalSignal: ModalSignal,
        addQuizToFolderNameSignal: AddQuizToFolderNameSignal
    }
}
