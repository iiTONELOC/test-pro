import { JSX } from 'preact/jsx-runtime';
import { useMountedState, } from '../../hooks';
import { DraggableItem } from '../DragAndDrop';
import { useEffect, useRef, useState } from 'preact/hooks';
import { Folder, FolderOpen } from '../../assets/icons';
import { VirtualFileSystemComponent } from './VirtualFileSystem';
import { IVirtualDirectory, VirtualFileSystem, getVirtualFileSystemFromStorage, trimClasses } from '../../utils';


const listItemClasses = `text-gray-300 w-full flex flex-col items-start justify-start hover:bg-slate-800
rounded-md p-1 transition ease-in delay-100 cursor-pointer gap-1`;

export interface IVirtualFolderProps {
    virtualFolder: IVirtualDirectory;
    virtualFileSystem: VirtualFileSystem[];
    dropHandler: (draggedItemId: string, targetItemId: string) => void;
    updateVirtualFileSystem: (virtualFileSystem: VirtualFileSystem[]) => void;
}

export function VirtualFolder({
    dropHandler,
    virtualFolder,
    virtualFileSystem,
    updateVirtualFileSystem
}: IVirtualFolderProps): JSX.Element {// NOSONAR
    const listItemRef = useRef<HTMLLIElement>(null);
    const [isOpen, setIsOpen] = useState(false);
    const isMounted = useMountedState();



    useEffect(() => {
        if (!isMounted) return;
        setIsOpen(virtualFolder.isOpen);
    }, [isMounted]);


    const classNames = 'w-5 h-5';
    const toggleOpen = (e: Event) => {
        e.stopPropagation();
        e.preventDefault();
        setIsOpen(!isOpen);

        if (virtualFolder.isOpen !== !isOpen) {
            virtualFolder.isOpen = !isOpen;
            // grab the virtual file system from local storage
            const storage = getVirtualFileSystemFromStorage()
            // look for the virtual folder in the virtual file system, it could be nested at any level

            const lookForFolder = (virtualFileSystem: VirtualFileSystem[], virtualFolder: IVirtualDirectory): VirtualFileSystem | undefined => {
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

            localStorage.setItem('virtualFileSystem', JSON.stringify(storage));


            // updateVirtualFileSystem(virtualFileSystem);
        }
    }

    return isMounted ? (
        <li
            ref={listItemRef}
            onClick={toggleOpen}
            onKeyDown={() => { }}
            data-id={virtualFolder.name}
            className={trimClasses(listItemClasses)}
        >
            <DraggableItem id={virtualFolder.name} >
                <span tabIndex={0} className={'w-full flex flex-row gap-1 items-center'}>

                    {isOpen ? <FolderOpen className={classNames} /> : <Folder className={classNames} />}
                    <p data-id={virtualFolder.name} className={'text-sm'}>
                        {virtualFolder.name}
                    </p>

                </span>
            </DraggableItem>
            {isOpen && virtualFolder.children.length > 0 &&
                <VirtualFileSystemComponent
                    // id={virtualFolder?.name}
                    dropHandler={dropHandler}
                    virtualFileSystem={virtualFolder.children}
                    updateVirtualFileSystem={updateVirtualFileSystem}
                />}
        </li>
    ) : <></>
}
