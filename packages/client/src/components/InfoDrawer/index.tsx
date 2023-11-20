import { JSX } from 'preact/jsx-runtime';
import { VirtualFile } from './VirtualFile';
import { useInfoDrawerSignal } from '../../signals';
import { DroppableArea, handleOnDrop } from '../DragAndDrop';
import { useMountedState, useVirtualFileSystem } from '../../hooks';
import { VirtualFileSystem, IVirtualFile, trimClasses } from '../../utils';

const drawerClasses = `bg-gray-950/[.75] h-[calc(100vh-44px)] w-1/3 lg:w-1/4 xl:w-1/6 p-1 truncate text-xs 
sm:text-sm lg:text-md xl:text-base flex`;
const ulClasses = 'bg-gray-900 w-full h-full overflow-y-auto p-3 rounded-sm';
const liClasses = 'text-center text-gray-500';


export function InfoDrawer(): JSX.Element {
    const { virtualFileSystem, updateVirtualFileSystem } = useVirtualFileSystem();
    const { isDrawerOpen } = useInfoDrawerSignal();
    const isMounted: boolean = useMountedState();

    const hideDrawer = !isDrawerOpen.value;

    const dropHandler = (draggedItemId: string, targetItemId: string) =>
        handleOnDrop(
            draggedItemId,
            targetItemId,
            virtualFileSystem,
            updateVirtualFileSystem
        );

    if (hideDrawer) return <></>

    return isMounted ? (
        <div className={trimClasses(drawerClasses)}>
            <DroppableArea onDrop={dropHandler}>
                <ul tabIndex={0} className={ulClasses}>
                    {virtualFileSystem.length > 0 && virtualFileSystem.map((entry: VirtualFileSystem, index: number) => (
                        <VirtualFile key={`${entry.name}-${index}`} file={entry as IVirtualFile} />// NOSONAR
                    ))}

                    {virtualFileSystem.length === 0 &&
                        <li className={liClasses}>No Quizzes Found!</li>
                    }
                </ul>
            </DroppableArea>

        </div>
    ) : <></>
}

export default InfoDrawer;

export { InfoDrawerToggler } from './InfoDrawerToggler';
