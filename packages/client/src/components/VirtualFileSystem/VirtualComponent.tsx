import { Ref } from 'preact';
import { JSX } from 'preact/jsx-runtime';
import { ReactNode } from 'preact/compat';
import { trimClasses } from '../../utils';
import { ContextMenu } from '../ContextMenu';
import { DraggableItem } from '../DragAndDrop';
import { useContextMenuSignal, useSelectedFileSignal } from '../../signals';


export interface IVirtualComponentProps {
    isFolder?: boolean;
    className?: string;
    draggableId: string;
    ref: Ref<HTMLLIElement>;
    children?: ReactNode | ReactNode[];
    onClick?: (event: MouseEvent) => void;
    onKeyDown: (event: KeyboardEvent) => void;
    onMouseDown?: (event: MouseEvent) => void;
}

const defaultClasses = `text-gray-300 w-full flex flex-col items-center hover:bg-slate-800
rounded-md p-1 transition ease-in delay-100 cursor-pointer gap-1 overflow-x-clip truncate focus:bg-slate-800`;

const slate800Hex = `#1e293b`;

export default function VirtualComponent(props: Readonly<IVirtualComponentProps>): JSX.Element {
    const { ref, onClick, onKeyDown, onMouseDown, className, children, draggableId, isFolder = false } = props;
    const { position, showContextMenu, id, isFolder: folder } = useContextMenuSignal();
    const { selectedFile } = useSelectedFileSignal();

    const isActive = draggableId === selectedFile.value;
    const activeBackgroundStyle = isActive ? slate800Hex : '';

    const handler = (e: MouseEvent) => {

        e.stopPropagation();
        e.preventDefault();
        // remove focus from the ref
        // @ts-ignore
        ref?.current?.blur();
        window.focus();
        if (e.button === 2 && showContextMenu.value === false) {
            position.value = {
                x: e.clientX,
                y: e.clientY
            }
            id.value = draggableId;
            folder.value = isFolder;
            showContextMenu.value = true;

            // set a click listener to close the context menu any click on the document
            document.addEventListener('click', () => {
                showContextMenu.value = false;
            }, { once: true });
        }
    };



    return (
        <DraggableItem id={draggableId}>
            <li
                ref={ref}
                tabIndex={0}
                onClick={onClick}
                onKeyDown={onKeyDown}
                onContextMenu={handler}
                onMouseDown={onMouseDown}
                style={{ backgroundColor: activeBackgroundStyle }}
                className={trimClasses(className ?? defaultClasses)}
            >
                {children}
                {showContextMenu.value && position && <ContextMenu />}
            </li>
        </DraggableItem>
    )
}
