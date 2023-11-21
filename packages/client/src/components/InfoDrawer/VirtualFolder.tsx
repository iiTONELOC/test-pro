import { JSX } from 'preact/jsx-runtime';
import { useRef, useState } from 'preact/hooks';
import { Folder, FolderOpen } from '../../assets/icons';
import { DraggableItem, DroppableArea, handleOnDrop } from '../DragAndDrop';
import { IVirtualDirectory, VirtualFileSystem, trimClasses } from '../../utils';
import { VirtualFileSystemComponent } from './VirtualFileSystem';
import { useMountedState, } from '../../hooks';




const listItemClasses = `text-gray-300 w-full flex flex-col items-start justify-start hover:bg-slate-800
rounded-md p-1 transition ease-in delay-100 cursor-pointer gap-1`;

export interface IVirtualFolderProps {
    virtualFolder: IVirtualDirectory;
    virtualFileSystem: VirtualFileSystem[];
    dropHandler: (draggedItemId: string, targetItemId: string) => void;
}

export function VirtualFolder({ virtualFolder, dropHandler }: IVirtualFolderProps): JSX.Element {// NOSONAR
    const listItemRef = useRef<HTMLLIElement>(null);
    const [isOpen, setIsOpen] = useState(false);
    const isMounted = useMountedState();


    const classNames = 'w-5 h-5';
    const toggleOpen = (e: Event) => {
        e.stopPropagation();
        e.preventDefault();
        setIsOpen(!isOpen);
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
                    <p data-id={virtualFolder.name} className={'text-base'}>
                        {virtualFolder.name}
                    </p>

                </span>
            </DraggableItem>
            {isOpen && virtualFolder.children.length > 0 &&
                <VirtualFileSystemComponent
                    // id={virtualFolder?.name}
                    virtualFileSystem={virtualFolder.children}
                    dropHandler={dropHandler}
                />}
        </li>

    ) : <></>
}
