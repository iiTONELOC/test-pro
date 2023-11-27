import { JSX } from 'preact/jsx-runtime';
import { useMountedState } from '../../hooks';
import { useContextMenuSignal } from '../../signals';
import { FolderActions } from './ActionButtons/FolderActions';
import { FileActions } from './ActionButtons/FileActions';

const buttonClasses = 'w-full p-1 text-white rounded-md boarder-2 hover:border-slate-900  hover:bg-slate-700';

export function ContextMenu(): JSX.Element {
    const { position, isFolder } = useContextMenuSignal();
    const isMounted = useMountedState();

    const ActionButtons = () => isFolder.value ? FolderActions({ className: buttonClasses }) :
        FileActions({ className: buttonClasses });

    return isMounted ? (
        <div
            style={{
                position: 'absolute',
                left: (position.value.x),
                top: (position.value.y),
                zIndex: 1000
            }}
            className={`bg-slate-950 opacity-90 w-[250px] h-auto p-2 rounded-md border-2 border-slate-700`}>
            <p className={'text-base'}>{`${isFolder.value ? 'Folder' : 'File'}`} Options</p>
            <hr className="border-slate-700 mb-3" />
            <menu className="flex flex-col w-full gap-1">
                <ActionButtons />
            </menu>
        </div>
    ) : <></>
}
