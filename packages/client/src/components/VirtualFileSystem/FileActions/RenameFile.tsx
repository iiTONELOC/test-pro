import { JSX } from 'preact/jsx-runtime';
import { useEffect } from 'preact/hooks';
import { useAddFolderFormState } from '../../../hooks';
import { convertStateObjectToArray, findFileInVfs, API, QuizModelResponse } from '../../../utils';
import { useInputModalSignal, useVirtualFileSystemSignal, useContextMenuSignal } from '../../../signals';


export function RenameFile(): JSX.Element {
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

            const existingFile = findFileInVfs(existingFileSystem, previousName);
            const file = existingFile.found;

            file && (file.name = input.value);

            API.updateQuizNameById(existingFile.found?.entryId as string, input.value).then((res: QuizModelResponse | null) => {
                if (res) {
                    show.value = false;
                    updateVirtualFileSystem(existingFileSystem);
                } else {
                    // Todo: enhance error handling and user feedback
                    alert('Failed to update quiz name');
                }
                input.value = '';
                id.value = '';
            });
        }
    };

    useEffect(() => {
        handleSubmit.value = handleOnSubmit;
        headingText.value = 'Enter a quiz name';
        show.value = true;
        showContextMenu.value = false;
    }, []);

    return (<></>)
}
