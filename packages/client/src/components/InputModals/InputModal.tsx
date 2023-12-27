import { ToolTip } from '../ToolTip';
import { JSX } from 'preact/jsx-runtime';
import { CloseCircle } from '../../assets/icons';
import { useEffect, useRef } from 'preact/hooks';
import { useInputModalSignal } from '../../signals';
import { useAddFolderFormState } from '../../hooks';


export function InputModal(): JSX.Element {
    const { show, handleSubmit, toggleModal, headingText, input, errorMessage } = useInputModalSignal();
    const { formState, setFormState } = useAddFolderFormState();
    const inputRef = useRef<HTMLInputElement>(null);


    const handleOnInput = (e: Event) => {
        const target = e.target as HTMLInputElement;
        setFormState({ input: target.value })
        input.value = target.value;
    }

    useEffect(() => {
        show.value && inputRef.current?.focus()

        !show.value && (() => {
            setFormState({ input: '' });
            input.value = '';
        })()
    }, [show.value]);


    return show.value ? (
        <div id='input-modal'
            className={'absolute w-full h-full z-100 flex flex-col justify-center items-center overflow-y-auto '}>
            <section className={'bg-slate-950 opacity-90 relative w-full  max-w-[350px] md:max-w-[400px] p-1 rounded-md border-2 border-slate-700'}>
                <header className={'flex flex-col items-center'}>
                    <span className={'absolute top-0 right-0 w-auto h-auto'}>
                        <ToolTip toolTipText='Close Modal'>
                            <CloseCircle
                                onClick={toggleModal}
                                className='static w-6 h-6 hover:w-7 hover:h-7 hover:text-red-600 hover:text-bold cursor-pointer text-gray-400 ease-in-out transition-all duration-200'
                            />
                        </ToolTip>
                    </span>

                    <h2 className={'w-full mt-3 text-center text-2xl'}>{headingText.value}</h2>
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
                            onInput={handleOnInput}
                        />
                        <span className={'mt-2 text-red-600'}>{errorMessage.value}</span>
                        <button
                            onClick={handleSubmit.value}
                            type={'submit'}
                            className={'w-1/2 p-1 m-1 mt-5 h-10 bg-slate-800 hover:bg-emerald-700 focus:bg-gray-700 rounded-md'}>Submit</button>
                    </form>
                </div>
            </section>
        </div>
    ) : <></>;
}
