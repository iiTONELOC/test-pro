import { JSX } from 'preact/jsx-runtime';
import { useState } from 'preact/hooks';
import { InputModal } from '../InputModal';
import { useMountedState } from '../../../hooks';
import { VirtualFileSystem, createVirtualDirectory } from '../../../utils';


export function getFolderNames(item: VirtualFileSystem): string[] {
    let names: string[] = [];
    // @ts-ignore
    if (item.children) {
        names.push(item.name);
        // @ts-ignore
        for (let child of item.children) {
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


export interface IAddFolderToRootProps {
    toggleClose: () => void;
    needToRefresh: () => void;
    virtualFileSystem: VirtualFileSystem[];
    updateVirtualFileSystem: (virtualFileSystem: VirtualFileSystem[]) => void;
}

export function AddFolderToRoot(props: IAddFolderToRootProps): JSX.Element {
    const { toggleClose, needToRefresh, virtualFileSystem, updateVirtualFileSystem } = props;
    const [inputErrorMessage, setInputErrorMessage] = useState<string | null>(null);
    const [formState, setFormState] = useState({ input: '' });
    const isMounted = useMountedState();

    const checkForInputErrors = (input: string): boolean => {
        let hasErrors = false;
        let errorMessage = '';

        if (!validateFileNames(input)) {
            hasErrors = true;
            errorMessage = 'Invalid file name. Please enter a valid file name.';
        }

        if (!checkUniqueFolderName(input, virtualFileSystem)) {
            hasErrors = true;
            errorMessage = 'File name already exists. Please enter a unique file name.';
        }

        if (hasErrors) {
            setInputErrorMessage(errorMessage);
        } else {
            setInputErrorMessage(null);
        }

        return hasErrors;
    }

    const handleOnSubmit = (e: Event) => {

        e.preventDefault();
        e.stopPropagation();
        const hasErrors = checkForInputErrors(formState.input);
        if (!hasErrors) {
            // create a virtual file system folder
            const newFolder = createVirtualDirectory(formState.input);
            // @ts-ignore
            const temp = virtualFileSystem;
            temp.push(newFolder);

            updateVirtualFileSystem(temp);
            needToRefresh();
            toggleClose();
        }
    }

    return isMounted ? (
        <InputModal
            formState={formState}
            toggleClose={toggleClose}
            setFormState={setFormState}
            handleSubmit={handleOnSubmit}
            headingText='Enter a folder name'
            inputErrorMessage={inputErrorMessage} />
    ) : <></>
}
