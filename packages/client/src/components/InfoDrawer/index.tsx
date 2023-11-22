import { JSX } from 'preact/jsx-runtime';
import { trimClasses } from '../../utils';
import { ActionButtons } from './ActionButtons';
import { useInfoDrawerSignal } from '../../signals';
import { DroppableArea, handleOnDrop } from '../DragAndDrop';
import { VirtualFileSystemComponent } from './VirtualFileSystem';
import { useMountedState, useVirtualFileSystem } from '../../hooks';
import { convertStateObjectToArray } from '../../hooks/useVirtualFileSystem';

const drawerClasses = `bg-gray-950/[.75] h-[calc(100vh-44px)] w-1/3 lg:w-1/4 xl:w-1/6 p-1 truncate text-xs 
sm:text-sm lg:text-md xl:text-base flex flex-col justify-start`;

const liClasses = 'text-center text-gray-500';

export function InfoDrawer(): JSX.Element {
    const { virtualFileSystem, updateVirtualFileSystem, setRefresh } = useVirtualFileSystem();

    const { isDrawerOpen } = useInfoDrawerSignal();
    const isMounted: boolean = useMountedState();

    const hideDrawer = !isDrawerOpen.value;
    const vfs = virtualFileSystem;

    const vfsArray = convertStateObjectToArray(vfs);

    const dropHandler = (draggedItemId: string, targetItemId: string) =>
        handleOnDrop({
            draggedItemId,
            targetItemId,
            virtualFileSystem: vfsArray,
            updateVirtualFileSystem
        });

    if (hideDrawer) return <></>

    return isMounted ? (
        <div className={trimClasses(drawerClasses)}>
            <ActionButtons
                needToRefresh={setRefresh}
                virtualFileSystem={vfsArray}
                updateVirtualFileSystem={updateVirtualFileSystem} />

            <DroppableArea onDrop={dropHandler} id={'__root__'}>
                <VirtualFileSystemComponent

                    dropHandler={dropHandler}

                    virtualFileSystem={vfsArray}
                    updateVirtualFileSystem={updateVirtualFileSystem}
                />

                <div data-id='__root__' className={'invisible w-full bock h-16'}> </div>
            </DroppableArea>
            {Object.keys(vfs).length === 0 &&
                <p className={liClasses}>No Quizzes Found!</p>
            }
        </div>
    ) : <></>
}

export default InfoDrawer;

export { InfoDrawerToggler } from './InfoDrawerToggler';
