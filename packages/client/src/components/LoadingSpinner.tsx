import { JSX } from 'preact/compat';

export function LoadingSpinner(): JSX.Element {
    return (
        <div className={'w-auto h-auto flex flex-col justify-center items-center'}>
            <div className={"animate-spin inline-block w-7 h-7 border-[3px] border-current border-t-transparent text-indigo-600 rounded-full"} role="status" aria-label="loading">
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    )
}