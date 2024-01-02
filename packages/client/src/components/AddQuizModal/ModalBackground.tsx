import { ReactNode, JSX } from 'preact/compat';

export function ModalBackground({ children }: { children: ReactNode | ReactNode[] }): JSX.Element {
    return (
        <div className={'w-full h-full overflow-y-auto absolute z-50 bg-gray-950/90 flex flex-wrap flex-row justify-center items-center p-3'}>
            {children}
        </div>
    )
}
