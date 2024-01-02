import { ReactNode, JSX } from 'preact/compat';

export function ModalCard({ children }: { children: ReactNode | ReactNode[] }): JSX.Element {
    return (
        <div className={'w-5/6 lg:w-1/2 p-2 h-auto bg-slate-950 border-2 border-slate-700 rounded-md flex flex-col justify-center items-center relative'}>
            {children}
        </div>
    )
}
