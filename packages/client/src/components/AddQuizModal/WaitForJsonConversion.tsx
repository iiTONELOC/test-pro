import { JSX } from 'preact/compat';
import { LoadingSpinner } from '../LoadingSpinner';

export function WaitForJsonConversion(): JSX.Element {
    return (
        <div className={'w-full h-full flex flex-col justify-center items-center'}>
            <p className={'text-lg w-full flex flex-row justify-center items-center'}>
                Please Wait, Converting File to JSON...<span className={'ml-2 mb-2'}><LoadingSpinner /></span>
            </p>
        </div>
    )
}