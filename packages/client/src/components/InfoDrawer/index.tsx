import { JSX } from 'preact/jsx-runtime';
import { trimClasses } from '../../utils';
import { ActionButtons } from './ActionButtons';
import { useInfoDrawerSignal } from '../../signals';
import { DroppableArea, handleOnDrop } from '../DragAndDrop';
import { VirtualFileSystemComponent } from './VirtualFileSystem';
import { useMountedState, useVirtualFileSystem } from '../../hooks';

const drawerClasses = `bg-gray-950/[.75] h-[calc(100vh-44px)] w-1/3 lg:w-1/4 xl:w-1/6 p-1 truncate text-xs 
sm:text-sm lg:text-md xl:text-base flex flex-col justify-start`;

const liClasses = 'text-center text-gray-500';

export function InfoDrawer(): JSX.Element {
    const { virtualFileSystem, updateVirtualFileSystem, setRefresh } = useVirtualFileSystem();
    const { isDrawerOpen } = useInfoDrawerSignal();
    const isMounted: boolean = useMountedState();

    const hideDrawer = !isDrawerOpen.value;
    const vfs = virtualFileSystem;

    const dropHandler = (draggedItemId: string, targetItemId: string) =>
        handleOnDrop({
            draggedItemId,
            targetItemId,
            virtualFileSystem,
            updateVirtualFileSystem
        });

    if (hideDrawer) return <></>

    return isMounted ? (
        <div className={trimClasses(drawerClasses)}>
            <ActionButtons
                needToRefresh={setRefresh}
                virtualFileSystem={virtualFileSystem}
                updateVirtualFileSystem={updateVirtualFileSystem} />

            <DroppableArea onDrop={dropHandler} id={'__root__'}>
                <VirtualFileSystemComponent virtualFileSystem={virtualFileSystem} dropHandler={dropHandler} />

                <div data-id='__root__' className={'invisible w-full bock h-16'}> </div>
            </DroppableArea>
            {vfs.length === 0 &&
                <p className={liClasses}>No Quizzes Found!</p>
            }
        </div>
    ) : <></>
}

export default InfoDrawer;

export { InfoDrawerToggler } from './InfoDrawerToggler';
