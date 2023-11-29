import { useMemo } from 'preact/hooks';
import { JSX } from 'preact/jsx-runtime';
import { ActionButtons } from './ActionButtons';
import { useVirtualFileSystem } from '../../hooks';
import { useInfoDrawerSignal } from '../../signals';
import { DroppableArea, handleOnDrop } from '../DragAndDrop';
import { VirtualFileSystemComponent } from '../VirtualFileSystem';
import { trimClasses, convertStateObjectToArray } from '../../utils';

const drawerClasses = `bg-gray-950/[.75] h-full w-1/3 lg:w-1/4 xl:w-1/6 p-1 truncate text-xs 
sm:text-sm lg:text-md xl:text-base flex flex-col justify-start`;

const liClasses = 'text-center text-gray-500';

export function InfoDrawer(): JSX.Element {
    const { virtualFileSystem, updateVirtualFileSystem, setRefresh } = useVirtualFileSystem();
    const { isDrawerOpen } = useInfoDrawerSignal();

    const hideDrawer = !isDrawerOpen.value;
    const vfsArray = useMemo(() => convertStateObjectToArray(virtualFileSystem), [virtualFileSystem]);

    const dropHandler = (draggedItemId: string, targetItemId: string) =>
        handleOnDrop({
            draggedItemId,
            targetItemId,
            updateVirtualFileSystem,
            virtualFileSystem: vfsArray
        });

    if (hideDrawer) return <></>

    return (
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
            {Object.keys(virtualFileSystem).length === 0 &&
                <p className={liClasses}>No Quizzes Found!</p>
            }
        </div>
    )
}

export default InfoDrawer;

export { InfoDrawerToggler } from './InfoDrawerToggler';
