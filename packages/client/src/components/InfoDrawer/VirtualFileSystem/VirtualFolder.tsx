import { JSX } from 'preact/jsx-runtime';
import { useMountedState } from '../../../hooks';
import VirtualComponent from './VirtualComponent';
import { Folder, FolderOpen } from '../../../assets/icons';
import { useEffect, useRef, useState } from 'preact/hooks';
import { VirtualFileSystemComponent } from './VirtualFileSystem';
import {
    API, IVirtualDirectory, VirtualFileSystem, getVirtualFileSystem,
    convertArrayToStateObject, createVfsObject, toJsonObj
} from '../../../utils';


export interface IVirtualFolderProps {
    virtualFolder: IVirtualDirectory;
    dropHandler: (draggedItemId: string, targetItemId: string) => void;
    updateVirtualFileSystem: (virtualFileSystem: VirtualFileSystem[]) => void;
}

export function VirtualFolder({ dropHandler, virtualFolder, updateVirtualFileSystem }: IVirtualFolderProps): JSX.Element {// NOSONAR
    const listItemRef = useRef<HTMLLIElement>(null);
    const [isOpen, setIsOpen] = useState(false);
    const isMounted = useMountedState();

    const folderClassNames = 'w-5 h-5';

    const toggleOpen = (e: Event) => {
        e.stopPropagation();
        e.preventDefault();
        setIsOpen(!isOpen);

        if (virtualFolder.isOpen !== !isOpen) {
            virtualFolder.isOpen = !isOpen;
            (async () => {
                const storage = await getVirtualFileSystem()
                const lookForFolder = (
                    virtualFileSystem: VirtualFileSystem[],
                    virtualFolder: IVirtualDirectory
                ): VirtualFileSystem | undefined => {

                    for (const entry of virtualFileSystem) {
                        if (entry.name === virtualFolder.name) {
                            // @ts-ignore
                            return entry;
                        }
                        if ('children' in entry) {
                            let found = lookForFolder(entry.children, virtualFolder);
                            if (found) return found;
                        }
                    }
                }

                const found = lookForFolder(storage, virtualFolder) as IVirtualDirectory;
                found.isOpen = !isOpen;

                const updatedVfs = createVfsObject(convertArrayToStateObject(storage));
                await API.updateVfs(toJsonObj(updatedVfs));
            })();
        }
    }

    useEffect(() => {
        if (!isMounted) return;
        setIsOpen(virtualFolder.isOpen);
    }, [isMounted]);

    return isMounted ? (
        <VirtualComponent
            isFolder={true}
            ref={listItemRef}
            onClick={toggleOpen}
            onKeyDown={() => { }}
            draggableId={virtualFolder.name}
        >
            <span tabIndex={0} className={'w-full flex flex-row gap-1 items-center '}>
                {isOpen ?
                    <FolderOpen className={folderClassNames} /> :
                    <Folder className={folderClassNames} />
                }
                <p data-id={virtualFolder.name} className={'text-sm'}>
                    {virtualFolder.name}
                </p>
            </span>
            {
                isOpen && virtualFolder.children.length > 0 &&
                <VirtualFileSystemComponent
                    dropHandler={dropHandler}
                    virtualFileSystem={virtualFolder.children}
                    updateVirtualFileSystem={updateVirtualFileSystem}
                />
            }
        </VirtualComponent>
    ) : <></>
}
