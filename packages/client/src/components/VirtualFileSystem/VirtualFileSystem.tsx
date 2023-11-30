import { JSX } from 'preact/jsx-runtime';
import { VirtualFile } from './VirtualFile';
import { useMountedState } from '../../hooks';
import { VirtualFolder } from './VirtualFolder';
import { VirtualFileSystem, IVirtualFile, IVirtualDirectory } from '../../utils';

const ulClasses = ' bg-slate-950 w-full h-auto p-1 rounded-sm ';
export interface IVirtualFileSystemProps {
    virtualFileSystem: VirtualFileSystem[];
    dropHandler: (draggedItemId: string, targetItemId: string) => void;
}

export function VirtualFileSystemComponent({ dropHandler, virtualFileSystem }: Readonly<IVirtualFileSystemProps>): JSX.Element {
    const isMounted = useMountedState();

    return isMounted ? (
        <ul className={ulClasses}>
            {virtualFileSystem.length > 0 && virtualFileSystem.map((entry: VirtualFileSystem, index: number) => {
                if (!entry) return <></>;
                //@ts-ignore
                if ('children' in entry as IVirtualDirectory) {
                    return <VirtualFolder
                        key={`${entry.name}`}
                        dropHandler={dropHandler}
                        virtualFolder={entry as IVirtualDirectory}

                    />// NOSONAR
                } else {
                    return <VirtualFile key={`${entry.name}-${index}`} file={entry as IVirtualFile} />// NOSONAR 
                }
            })}
        </ul>
    ) : <></>;
}
