import { JSX } from 'preact/jsx-runtime';
import { useEffect } from 'preact/hooks';
import { useAddFolderFormState } from '../../../hooks';
import { useContextMenuSignal, useInputModalSignal, useVirtualFileSystemSignal } from '../../../signals';
import { IVirtualDirectory, convertStateObjectToArray, createVirtualDirectory, findFolderInVfs } from '../../../utils';

export interface IAddFolderToFolderProps {
    targetFolderName: string;
}

export function AddFolderToFolder(props: Readonly<IAddFolderToFolderProps>): JSX.Element {
    const { virtualFileSystem, updateVirtualFileSystem } = useVirtualFileSystemSignal();
    const { show, handleSubmit, headingText, toggleModal, input } = useInputModalSignal();
    const { checkForInputErrors } = useAddFolderFormState();
    const { showContextMenu, id } = useContextMenuSignal();
    const { targetFolderName } = props;


    const handleOnSubmit = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();

        const hasErrors = checkForInputErrors(input.value);

        // no errors, create the folder
        if (!hasErrors) {
            const newFolder = createVirtualDirectory(input.value);
            // @ts-ignore
            const temp = convertStateObjectToArray(virtualFileSystem.value);

            const folderToUpdate = findFolderInVfs(temp, targetFolderName);
            const containingFolder = folderToUpdate.containingFolder as IVirtualDirectory;
            const folder = folderToUpdate.found as IVirtualDirectory;

            // add the folder to the containing folder and set the containing folder to open
            if (folder) {
                folder.children.push(newFolder);
                folder.isOpen = true;
                containingFolder && (containingFolder.isOpen = true);
            }

            // reset the signal values
            input.value = '';
            id.value = '';


            // update the virtual file system, call the close callback and close the modal
            updateVirtualFileSystem(temp);
            toggleModal();

            showContextMenu.value = false;
        }
    }

    useEffect(() => {
        handleSubmit.value = handleOnSubmit;
        headingText.value = 'Enter a folder name';
        show.value = true;
    }, []);

    return (<></>)
}
