import { JSX } from 'preact/jsx-runtime';
import { VirtualFile } from './VirtualFile';
import { useMountedState } from '../../hooks';
import { VirtualFolder } from './VirtualFolder';
import { VirtualFileSystem, IVirtualFile, IVirtualDirectory, uuid } from '../../utils';


// import { useEffect } from 'preact/hooks';

const ulClasses = 'bg-gray-900 w-full h-full overflow-y-auto p-1 rounded-sm';


export interface IVirtualFileSystemProps {
    dropHandler: (draggedItemId: string, targetItemId: string) => void;
    virtualFileSystem: VirtualFileSystem[];
}

export function VirtualFileSystemComponent({ dropHandler, virtualFileSystem }: Readonly<IVirtualFileSystemProps>): JSX.Element {
    const isMounted = useMountedState();

    return isMounted ? (
        // <DroppableArea id={id} onDrop={dropHandler}>
        <ul className={ulClasses}>
            {virtualFileSystem.length > 0 && virtualFileSystem.map((entry: VirtualFileSystem, index: number) => {
                if (!entry) return <></>;
                //@ts-ignore
                if ('children' in entry as IVirtualDirectory) {

                    return <VirtualFolder
                        key={`${entry.name}-${uuid()}`}
                        virtualFolder={entry as IVirtualDirectory}
                        virtualFileSystem={virtualFileSystem}
                        dropHandler={dropHandler}
                    />// NOSONAR
                } else {
                    return <VirtualFile key={`${entry.name}-${index}`} file={entry as IVirtualFile} />// NOSONAR 
                }
            })}
        </ul>
        // </DroppableArea>
    ) : <></>
}