import { JSX } from 'preact/jsx-runtime';
import { useEffect } from 'preact/hooks';
import { useAddFolderFormState } from '../../../hooks';
import { convertStateObjectToArray, findFolderInVfs } from '../../../utils';
import { useInputModalSignal, useVirtualFileSystemSignal, useContextMenuSignal } from '../../../signals';


export function RenameFolder(): JSX.Element {
    const { virtualFileSystem, updateVirtualFileSystem } = useVirtualFileSystemSignal();
    const { show, handleSubmit, headingText, input } = useInputModalSignal();
    const { checkForInputErrors } = useAddFolderFormState();
    const { id, showContextMenu } = useContextMenuSignal();

    const handleOnSubmit = (e: Event) => {
        e?.preventDefault();
        e?.stopPropagation();
        const hasErrors = checkForInputErrors(input.value);
        const existingFileSystem = convertStateObjectToArray(virtualFileSystem.value);
        if (!hasErrors) {
            const previousName = id.value;

            const existingFolder = findFolderInVfs(existingFileSystem, previousName);
            const folder = existingFolder.found;

            folder && (folder.name = input.value);
            input.value = '';
            id.value = '';
            show.value = false;
        }

        updateVirtualFileSystem(existingFileSystem);
    };

    useEffect(() => {
        handleSubmit.value = handleOnSubmit;
        headingText.value = 'Enter a folder name';
        show.value = true;
        showContextMenu.value = false;
    }, []);

    return (<></>)
}
