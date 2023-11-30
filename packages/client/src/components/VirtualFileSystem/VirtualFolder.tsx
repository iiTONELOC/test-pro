import { JSX } from 'preact/jsx-runtime';
import { useMountedState } from '../../hooks';
import VirtualComponent from './VirtualComponent';
import { ChevronDown, ChevronRight, Folder, FolderOpen } from '../../assets/icons';
import { useEffect, useRef, useState } from 'preact/hooks';
import { VirtualFileSystemComponent } from './VirtualFileSystem';
import {
    API, IVirtualDirectory, getVirtualFileSystem,
    convertArrayToStateObject, createVfsObject, toJsonObj, findFolderInVfs, keyHandler
} from '../../utils';
import { useContextMenuSignal } from '../../signals';
import { ReactNode } from 'preact/compat';


export interface IVirtualFolderProps {
    virtualFolder: IVirtualDirectory;
    dropHandler: (draggedItemId: string, targetItemId: string) => void;
}

function Span({ children }: Readonly<{ children: ReactNode | ReactNode[] }>): JSX.Element {
    return <span className={'w-auto flex flex-row justify-start items-center gap-1'}>{children}</span>
}

export function VirtualFolder({ dropHandler, virtualFolder }: IVirtualFolderProps): JSX.Element {// NOSONAR
    const listItemRef = useRef<HTMLLIElement>(null);
    const { showContextMenu } = useContextMenuSignal();

    const [isOpen, setIsOpen] = useState(false);
    const isMounted = useMountedState();

    const folderClassNames = 'w-4 h-4';

    const toggleOpen = (e: Event) => {
        e?.stopPropagation();
        e?.preventDefault();

        const tagName = (e.target as HTMLElement).tagName;
        const dataId = (e.target as HTMLElement).dataset.id;
        // @ts-ignore
        if ((dataId !== virtualFolder.name) && (tagName !== 'svg' && tagName !== 'SPAN' && tagName !== 'LI')) {
            return
        };

        // if we didn't click on any of the above, then we need to ensure that the context menu is closed
        if (showContextMenu.value) {
            showContextMenu.value && (showContextMenu.value = false);
        }


        setIsOpen(!isOpen);

        if (virtualFolder.isOpen !== !isOpen) {
            virtualFolder.isOpen = !isOpen;
            (async () => {
                const storage = await getVirtualFileSystem();
                const data = findFolderInVfs(storage, virtualFolder.name);
                const found = data.found as IVirtualDirectory;

                found && (found.isOpen = !isOpen);

                const updatedVfs = createVfsObject(convertArrayToStateObject(storage));
                await API.updateVfs(toJsonObj(updatedVfs));
            })();
        }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
        keyHandler({
            event: e,
            keyToWatch: 'Enter',
            callback: () => toggleOpen(e as unknown as Event)
        });

        keyHandler({
            event: e,
            keyToWatch: ' ',
            callback: () => toggleOpen(e as unknown as Event)
        });
    };

    useEffect(() => {
        if (!isMounted) return;
        setIsOpen(virtualFolder.isOpen);
    }, [isMounted, virtualFolder.isOpen]);

    return (
        <VirtualComponent
            isFolder={true}
            ref={listItemRef}
            onClick={toggleOpen}
            onKeyDown={handleKeyDown}
            draggableId={virtualFolder.name}
        >
            <span className={'w-full flex flex-row gap-1 items-center '}>
                {isOpen ?
                    <Span> <ChevronDown className={folderClassNames} /><FolderOpen className={folderClassNames} /> </Span> :

                    <Span> <ChevronRight className={folderClassNames} /><Folder className={folderClassNames} /> </Span>
                }
                <p data-id={virtualFolder.name} className={'text-xs'}>
                    {virtualFolder.name}
                </p>
            </span>
            {
                isOpen && virtualFolder.children.length > 0 &&
                <VirtualFileSystemComponent
                    dropHandler={dropHandler}
                    virtualFileSystem={virtualFolder.children}
                />
            }
        </VirtualComponent>
    )
}
