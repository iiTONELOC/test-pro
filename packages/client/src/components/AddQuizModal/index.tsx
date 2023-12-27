import { JSX } from 'preact/jsx-runtime';
import { trimClasses, } from '../../utils';
import { AddQuizForm } from './addQuizForm';
import { CloseCircle } from '../../assets/icons';
import { useShowAddQuizModalSignal } from '../../signals';


const titleClasses = 'text-2xl my-3';
const iconClasses = `w-7 h-7 hover:w-8 hover:h-8 hover:text-red-600 hover:text-bold cursor-pointer 
text-gray-400 justify-self-end absolute top-1 right-1 ease-in-out transition-all duration-200`;

export const handleCloseModal = () => useShowAddQuizModalSignal().showAddQuizModalSignal.value = false;



export function AddQuizModal(): JSX.Element {
    const show = useShowAddQuizModalSignal().showAddQuizModalSignal.value;

    return show ? (
        <div className={'w-full h-full absolute z-50 bg-gray-950/90 flex flex-wrap flex-row justify-center items-center p-3'}>
            <div className={'w-5/6 md:w-4/6 lg:w-1/2 p-2  h-auto bg-slate-950 border-2 border-slate-700 rounded-md flex flex-col justify-center items-center relative'}>
                <CloseCircle className={trimClasses(iconClasses)} onClick={handleCloseModal} />

                <h1 className={titleClasses}>Import Quiz From File</h1>

                <AddQuizForm />
            </div>
        </div>
    ) : <></>;
}
