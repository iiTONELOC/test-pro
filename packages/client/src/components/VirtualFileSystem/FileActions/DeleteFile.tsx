import { JSX } from 'preact/jsx-runtime';
import { useEffect } from 'preact/hooks';
import { useAddFolderFormState } from '../../../hooks';
import { convertStateObjectToArray, findFileInVfs, API, QuizModelResponse, IVirtualFile } from '../../../utils';
import { useInputModalSignal, useVirtualFileSystemSignal, useContextMenuSignal } from '../../../signals';


export function DeleteFile(): JSX.Element {
    const { virtualFileSystem, updateVirtualFileSystem } = useVirtualFileSystemSignal();
    const { show, handleSubmit, headingText, input } = useInputModalSignal();
    const { checkForInputErrors } = useAddFolderFormState();
    const { id, showContextMenu } = useContextMenuSignal();

    const handleOnSubmit = (e: Event) => {
        e?.preventDefault();
        e?.stopPropagation();

        const fileId = id.value;
        const hasErrors = checkForInputErrors(input.value);
        let existingFileSystem = convertStateObjectToArray(virtualFileSystem.value);

        if (!hasErrors) {
            const existingFile = findFileInVfs(existingFileSystem, fileId);
            const containingFolder = existingFile.containingFolder;

            const filterFileByEntryId = (file: IVirtualFile) => {
                // may not have an entryId if it's a folder
                if (file.entryId) {
                    return file.entryId !== fileId;
                } else {
                    return true;
                }
            }

            if (input.value === existingFile.found?.name)
                API.deleteQuizById(fileId).then((res: QuizModelResponse | null) => {
                    if (res) {
                        (() => {
                            show.value = false;
                            containingFolder && (containingFolder.children = containingFolder.children.filter(file => filterFileByEntryId(file as IVirtualFile)));
                            !containingFolder && (existingFileSystem = existingFileSystem.filter(file => filterFileByEntryId(file as IVirtualFile)));
                            input.value = '';
                            id.value = '';

                            updateVirtualFileSystem(existingFileSystem);
                        })()
                    } else {
                        // Todo: enhance error handling and user feedback
                        alert('Failed to delete quiz');
                    }
                });
        }
    };

    useEffect(() => {
        handleSubmit.value = handleOnSubmit;
        headingText.value = 'Type the quiz name to confirm.';
        show.value = true;
        showContextMenu.value = false;
    }, []);

    return (<></>)
}
