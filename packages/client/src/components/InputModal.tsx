import { ToolTip } from './ToolTip';
import { JSX } from 'preact/jsx-runtime';
import { useMountedState } from '../hooks';
import { CloseCircle } from '../assets/icons';
import { useEffect, useRef, useState } from 'preact/hooks';
import { VirtualFileSystem, createVirtualDirectory } from '../utils';

export interface InputModalProps {
    toggleClose: () => void,
    headingText?: string,
    virtualFileSystem: VirtualFileSystem[],
    needToRefresh: () => void,
    updateVirtualFileSystem: (virtualFileSystem: VirtualFileSystem[]) => void,
}

function getFolderNames(item: VirtualFileSystem): string[] {
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


export function InputModal({ toggleClose, virtualFileSystem, needToRefresh, updateVirtualFileSystem, headingText = 'Input Modal' }: Readonly<InputModalProps>): JSX.Element {
    const isMounted = useMountedState();
    const inputRef = useRef<HTMLInputElement>(null);
    const [formState, setFormState] = useState({ input: '' });
    const [inputErrorMessage, setInputErrorMessage] = useState<string | null>(null);

    const validateFileNames = (input: string) => input !== '' && !/[^a-zA-Z0-9 ]/.test(input);

    const checkUniqueFolderName = (input: string) => {
        // folder names must be unique in the same directory
        const folderNames = virtualFileSystem.map((item) => getFolderNames(item)).flat();
        return !folderNames.includes(input);
    };

    const checkForInputErrors = (input: string): boolean => {
        let hasErrors = false;
        let errorMessage = '';

        if (!validateFileNames(input)) {
            hasErrors = true;
            errorMessage = 'Invalid file name. Please enter a valid file name.';
        }

        if (!checkUniqueFolderName(input)) {
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

    useEffect(() => {
        isMounted && inputRef.current?.focus();
    }, [isMounted]);


    return (
        <div className={'absolute w-screen h-screen z-10 flex flex-col justify-center items-center'}>
            <section className={'bg-black opacity-90 relative w-full max-w-lg p-1 rounded-md'}>
                <header className={'flex flex-col items-center'}>
                    <span className={'absolute top-0 right-0 w-auto h-auto'}>
                        <ToolTip toolTipText='Close Modal'>
                            <CloseCircle
                                onClick={toggleClose}
                                className='w-8 h-8 hover:w-10 hover:h-10 hover:text-red-600 hover:text-bold cursor-pointer text-gray-400'
                            />
                        </ToolTip>
                    </span>

                    <h2 className={'w-full mt-3 text-center text-2xl'}>{headingText}</h2>
                </header>

                <div className={'flex flex-col justify-center items-center mt-5'}>
                    <form className={'flex flex-col justify-center items-center w-full'}>
                        <label htmlFor={'input'} hidden>Input:</label>
                        <input
                            ref={inputRef}
                            id={'input'}
                            type={'text'}
                            className={'w-3/4 p-2 m-1 rounded-md text-white bg-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500'}
                            value={formState.input}
                            autoComplete={'off'}
                            onChange={(e) => setFormState({ input: e.currentTarget.value })}
                        />
                        <span className={'mt-2 text-red-600'}>{inputErrorMessage}</span>
                        <button
                            onClick={handleOnSubmit}
                            type={'submit'}
                            className={'w-1/2 p-1 m-1 mt-5 bg-gray-800 hover:bg-gray-700 focus:bg-gray-700 rounded-md'}>Submit</button>
                    </form>
                </div>
            </section>
        </div>
    );
}
