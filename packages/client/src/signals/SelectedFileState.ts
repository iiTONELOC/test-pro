import { signal, Signal } from '@preact/signals';

const selectedFile = signal<string>('');

export type SelectedFileState = {
    selectedFile: Signal<string>;
    setSelectedFile: (id: string) => void;
};

export const useSelectedFileState = (): SelectedFileState => {
    const setSelectedFile = (id: string) => {
        const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(id);
        if (isValidObjectId) {
            selectedFile.value = id;
        }
        if (id === '') {
            selectedFile.value = '';
        }
    };

    return { selectedFile, setSelectedFile };
};
