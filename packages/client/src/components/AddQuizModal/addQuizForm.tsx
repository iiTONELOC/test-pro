import { JSX } from 'preact/jsx-runtime';
import { useMountedState } from '../../hooks';
import { useState, useEffect, useRef } from 'preact/hooks';
import { convertStateObjectToArray, keyHandler, API } from '../../utils';
import { useShowAddQuizModalSignal, useVirtualFileSystemSignal } from '../../signals';
import { handleFileInput, handleQuizTitleInput, handleValidateQuizTitle } from './helpers';
import { jsonQuizData, quizType } from '../../utils/api';


const titleClasses = 'text-2xl my-3';
const labelClasses = 'text-xl mt-2 mb-3 mx-1';
const inputClasses = 'w-full p-2 rounded-md text-white bg-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500';

export const handleCloseModal = () => useShowAddQuizModalSignal().showAddQuizModalSignal.value = false;


function LabelContainer({ children }: { children: JSX.Element | JSX.Element[] }): JSX.Element {
    return (
        <div className={'flex flex-col justify-center items-start w-[95%] first-letter:p-1'}>
            {children}
        </div>
    )
}

function InputError({ errorMessage }: { errorMessage?: string | null }): JSX.Element {
    return (
        <span className={'text-red-600'}>{errorMessage}</span>
    )
}


export function AddQuizForm({ setConvertedFileData, setLoading }:
    {
        setConvertedFileData: (fileData: jsonQuizData[]) => void,
        setLoading: (loading: boolean) => void
    }
): JSX.Element {
    const [quizTitle, setQuizTitle] = useState<string>('');
    const [quizType, setQuizType] = useState<('ua' | 'test-out' | null)>(null);
    const [quizTitleValid, setQuizTitleValid] = useState<boolean>(false);
    const [quizTitleError, setQuizTitleError] = useState<string | null>(null);
    const [uploadedFiles, setUploadedFiles] = useState<(string | ArrayBuffer | null)[]>([]);

    const isMounted = useMountedState();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const quizTitleRef = useRef<HTMLInputElement>(null);
    const quizTypeInputRef = useRef<HTMLSelectElement>(null);
    const submitButtonRef = useRef<HTMLButtonElement>(null);

    const handleQuizTitleValidate = () => handleValidateQuizTitle(
        convertStateObjectToArray(useVirtualFileSystemSignal()
            .virtualFileSystem.value), quizTitle, setQuizTitleValid, setQuizTitleError);

    const handleQuizSubmit = () => {
        setLoading(true);

        API.convertTextToJSON(uploadedFiles[0] as string, quizType as quizType, quizTitle)
            .then((res: jsonQuizData[] | null) => {
                if (res) {
                    setConvertedFileData(res);
                    setLoading(false);
                } else {
                    // TODO: Handle showing error to user
                    console.log('error converting text to json');
                    setLoading(false);
                }
            })
            .catch((err) => {
                console.log(err);
            })
    };

    const resetState = () => {
        setUploadedFiles([]);
        setQuizTitle('');
        setQuizType(null);
        setQuizTitleValid(false);
        setQuizTitleError(null);
    };

    useEffect(() => {
        isMounted && resetState();
    }, [isMounted]);

    useEffect(() => {
        isMounted && uploadedFiles.length > 0 && (() => {
            // remove the file input's focus
            fileInputRef.current?.blur();
            // set the quiz title input's focus
            quizTitleRef.current?.focus();
        })()
    }, [uploadedFiles]);

    useEffect(() => {
        isMounted && quizTitleValid && (() => {
            setTimeout(() => {
                quizTitleRef.current?.blur();
                quizTypeInputRef.current?.focus();
            }, 100);
        })()
    }, [quizTitleValid]);


    useEffect(() => {
        isMounted && quizType && (() => {
            quizTypeInputRef.current?.blur();
            submitButtonRef.current?.focus();
        })()
    }, [quizType]);

    return (
        <>
            <h1 className={titleClasses}>Import Quiz From File</h1>
            <form
                onSubmit={(e: Event) => e.preventDefault()}
                className={'flex flex-col justify-center items-center w-full bg-slate-900 rounded-md p-2'}>
                {/* File Upload */}
                <LabelContainer>
                    <label htmlFor={'input'} className={labelClasses}>Select File:</label>
                    <input
                        required
                        type={'file'}
                        id='fileInput'
                        ref={fileInputRef}
                        autoComplete={'off'}
                        accept={'.txt, .text'}
                        className={inputClasses}
                        onInput={(e: Event) => handleFileInput(e, setUploadedFiles)}
                    />
                </LabelContainer>

                {/* Quiz Title */}
                {uploadedFiles.length > 0 && <LabelContainer>
                    <div className='w-full flex flex-row justify-start items-center gap-5'>
                        <label htmlFor={'title'} className={labelClasses}>Quiz Title:</label>
                        <InputError errorMessage={quizTitleError} />
                    </div>

                    <input
                        required
                        id={'title'}
                        type={'text'}
                        value={quizTitle}
                        ref={quizTitleRef}
                        autoComplete={'off'}
                        onBlur={handleQuizTitleValidate}
                        placeholder={'Enter Quiz Title - Must be unique'}
                        onInput={(e: Event) => handleQuizTitleInput(e, setQuizTitle)}
                        className={inputClasses + (quizTitleError ? ' focus:ring-red-600' : '')}
                        onKeyDown={(e: KeyboardEvent) => keyHandler({ event: e, keyToWatch: 'Enter', direction: 'down', callback: handleQuizTitleValidate })}
                    />
                </LabelContainer>
                }

                {/* Quiz Type - University or Arizona or Test Out */}
                {uploadedFiles.length > 0
                    && quizTitleValid
                    && <LabelContainer>
                        <div className='w-full flex flex-row justify-start items-center gap-5'>
                            <label htmlFor={'title'} className={labelClasses}>Quiz Type:</label>
                            <InputError errorMessage={quizTitleError} />
                        </div>

                        {/* use an option input */}
                        <select
                            required
                            id={'quizType'}
                            ref={quizTypeInputRef}
                            className={inputClasses + (quizTitleError ? ' focus:ring-red-600' : '')}
                            onInput={(e: Event) => setQuizType((e.target as HTMLSelectElement).value as 'ua' | 'test-out')}
                        >
                            <option value=''>Select Quiz Type</option>
                            <option value='ua'>University of Arizona</option>
                            <option value='test-out'>Test Out</option>
                        </select>
                    </LabelContainer>
                }

                {/* Submit Button */}
                {uploadedFiles.length > 0
                    && quizTitleValid
                    && quizType
                    && <button
                        type={'button'}
                        ref={submitButtonRef}
                        onClick={handleQuizSubmit}
                        className={'w-1/2 p-1 m-1 mt-5 h-10 bg-slate-800 hover:bg-green-700 focus:bg-green-700 rounded-md focus:ring-2 focus:ring-green-400'}>
                        Submit
                    </button>
                }
            </form>
        </>
    )
}
