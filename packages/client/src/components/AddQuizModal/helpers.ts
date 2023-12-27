import { findFileInVfs, VirtualFileSystem } from '../../utils';

export const isTextFile = (file: File) => file.type === 'text/plain' && (file.name.endsWith('.txt') || file.name.endsWith('.text'));

/**
 * On file input, read the files as text and set the uploadedFiles state to an array of the file contents
 * 
 * @param e - the event that triggered the file input
 * @param setUploadedFiles the function to set the uploadedFiles state
 */
export const handleFileInput = async (e: Event, setUploadedFiles: (files: (string | ArrayBuffer | null)[]) => void) => {
    const uploadedFiles: (string | ArrayBuffer | null)[] = [];
    const target = e.target as HTMLInputElement;
    const files = target.files ?? [];

    for (const file of files) {
        if (isTextFile(file)) {
            const reader = new FileReader();
            reader.readAsText(file);
            const result = await new Promise(resolve => {
                reader.onload = () => {
                    resolve(reader.result);
                }
            });

            uploadedFiles.push(result as string);
        }
    }

    setUploadedFiles(uploadedFiles);
};

export const handleQuizTitleInput = (e: Event, setQuizTitle: (title: string) => void) => {
    const target = e.target as HTMLInputElement;
    setQuizTitle(target.value);
};

export const handleValidateQuizTitle = async (
    vfs: VirtualFileSystem[],
    quizTitle: string,
    setQuizTitleValid: (valid: boolean) => void,
    setQuizTitleError: (error: string | null) => void
) => {
    const { found } = findFileInVfs(vfs, quizTitle);
    if (found) {
        setQuizTitleError('Quiz title must be unique');
        setQuizTitleValid(false);
    } else {
        // ensure the quiz title is valid (no special characters) and is not empty
        if (!/^[a-zA-Z0-9- ]+$/.test(quizTitle)) {
            setQuizTitleError('Quiz title must only contain letters, numbers, dashes, and spaces');
            setQuizTitleValid(false);
            return;
        }
        setQuizTitleError(null);
        setQuizTitleValid(true);
    }
};
