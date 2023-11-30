import { JSX } from 'preact/jsx-runtime';
import { useEffect } from 'preact/hooks';
import { useAddFolderFormState } from '../../../hooks';
import { useInputModalSignal, useVirtualFileSystemSignal } from '../../../signals';
import { convertStateObjectToArray, createVirtualDirectory } from '../../../utils';



export interface IAddFolderToRootProps {
    toggleClose: () => void;
}

export function AddFolderToRoot(props: Readonly<IAddFolderToRootProps>): JSX.Element {
    const { virtualFileSystem, updateVirtualFileSystem } = useVirtualFileSystemSignal();
    const { show, handleSubmit, headingText, input } = useInputModalSignal();
    const { checkForInputErrors } = useAddFolderFormState();
    const { toggleClose } = props;

    const handleOnSubmit = (e: Event) => {
        e?.preventDefault();
        e?.stopPropagation();
        const hasErrors = checkForInputErrors(input.value);
        if (!hasErrors) {
            // create a virtual file system folder
            const newFolder = createVirtualDirectory(input.value);
            // @ts-ignore
            const temp = convertStateObjectToArray(virtualFileSystem.value);
            temp.push(newFolder);
            input.value = '';
            updateVirtualFileSystem(temp);
            toggleClose();
        }
    };


    useEffect(() => {
        handleSubmit.value = handleOnSubmit;
        headingText.value = 'Enter a folder name';
        show.value = true;
    }, []);

    return <></>
}
