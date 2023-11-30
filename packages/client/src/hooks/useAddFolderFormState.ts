import { useState } from 'preact/hooks';
import { VirtualFileSystem, convertStateObjectToArray } from '../utils'
import { useInputModalSignal, useVirtualFileSystemSignal } from '../signals';


export function getFolderNames(item: VirtualFileSystem): string[] {
    let names: string[] = [];
    // @ts-ignore
    if (item.children) {
        names.push(item.name);
        // @ts-ignore
        for (const child of item.children) {
            names = names.concat(getFolderNames(child));
        }
    }
    return names;
}

export const validateFileNames = (input: string) => input !== '' && !/[^a-zA-Z0-9 ]/.test(input);

export const checkUniqueFolderName = (input: string, virtualFileSystem: VirtualFileSystem[]) => {
    // folder names must be unique in the same directory
    const folderNames = virtualFileSystem.map(item => getFolderNames(item)).flat();
    return !folderNames.includes(input);
};

export interface AddFolderFormState {
    inputErrorMessage: string | null;
    formState: { input: string };
    setFormState: (state: { input: string }) => void;
    checkForInputErrors: (input: string) => boolean;
}

export function useAddFolderFormState() {
    const { errorMessage: errors } = useInputModalSignal();
    const [formState, setFormState] = useState({ input: '' });
    const { virtualFileSystem } = useVirtualFileSystemSignal();
    const [inputErrorMessage, setInputErrorMessage] = useState<string | null>(null);

    const vfs = convertStateObjectToArray(virtualFileSystem.value);

    const checkForInputErrors = (input: string): boolean => {
        let hasErrors = false;
        let errorMessage = '';

        if (!validateFileNames(input)) {
            hasErrors = true;
            errorMessage = 'Invalid file name. Please enter a valid file name.';
        }

        if (!checkUniqueFolderName(input, vfs ?? [])) {
            hasErrors = true;
            errorMessage = 'File name already exists. Please enter a unique file name.';
        }

        if (hasErrors) {
            setInputErrorMessage(errorMessage);
            errors.value = errorMessage;
        } else {
            setInputErrorMessage(null);
            errors.value = null;
        }

        return hasErrors;
    }

    return {
        inputErrorMessage,
        formState,
        setFormState,
        checkForInputErrors
    }
}
