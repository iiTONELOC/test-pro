import { ToolTip } from '../ToolTip';
import { JSX } from 'preact/jsx-runtime';
import { CloseCircle } from '../../assets/icons';
import { useEffect, useRef } from 'preact/hooks';


export interface InputModalProps {
    headingText?: string,
    toggleClose: () => void,
    handleSubmit: (e: Event) => void,
    formState?: { input: string },
    inputErrorMessage?: string | null,
    setFormState?: (formState: { input: string }) => void,
}



export function InputModal(props: Readonly<InputModalProps>): JSX.Element {
    const { handleSubmit, toggleClose, headingText = 'Create New Folder', formState, setFormState, inputErrorMessage } = props;
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);


    return (
        <div className={'absolute w-[calc(100vw-55px)] h-screen z-10 flex flex-col justify-center items-center'}>
            <section className={'bg-slate-950 opacity-90 relative w-full  max-w-[350px] md:max-w-[400px] p-1 rounded-md'}>
                <header className={'flex flex-col items-center'}>
                    <span className={'absolute top-0 right-0 w-auto h-auto'}>
                        <ToolTip toolTipText='Close Modal'>
                            <CloseCircle
                                onClick={toggleClose}
                                className='static w-8 h-8 hover:w-10 hover:h-10 hover:text-red-600 hover:text-bold cursor-pointer text-gray-400'
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
                            value={formState?.input}
                            autoComplete={'off'}
                            onChange={(e) => setFormState?.({ input: e.currentTarget.value })}
                        />
                        <span className={'mt-2 text-red-600'}>{inputErrorMessage}</span>
                        <button
                            onClick={handleSubmit}
                            type={'submit'}
                            className={'w-1/2 p-1 m-1 mt-5 h-10 bg-slate-800 hover:bg-slate-700 focus:bg-gray-700 rounded-md'}>Submit</button>
                    </form>
                </div>
            </section>
        </div>
    );
}
