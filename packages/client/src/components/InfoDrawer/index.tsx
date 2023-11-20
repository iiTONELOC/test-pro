import { JSX } from 'preact/jsx-runtime';
import { VirtualFile } from './VirtualFile';
import { useMountedState } from '../../hooks';
import { useEffect, useState } from 'preact/hooks';
import { useInfoDrawerSignal, useQuizzesDbSignal } from '../../signals';
import { trimClasses, getVirtualFileSystemFromStorage, generateFileSystem, API } from '../../utils';

import type { PopulatedQuizModel, QuizModelResponse, VirtualFileSystem, IVirtualDirectory, IVirtualFile } from '../../utils';
import { DroppableArea } from '../DragAndDrop';
import { setVirtualFileSystemToStorage } from '../../utils/virtualFileSystem';

const drawerClasses = `bg-gray-950/[.75] h-[calc(100vh-44px)] w-1/3 lg:w-1/4 xl:w-1/6 p-1 truncate text-xs 
sm:text-sm lg:text-md xl:text-base flex`;
const ulClasses = 'bg-gray-900 w-full h-full overflow-y-auto p-3 rounded-sm';
const liClasses = 'text-center text-gray-500';

export function InfoDrawer(): JSX.Element {
    const [virtualFileSystem, setVirtualFileSystem] = useState<VirtualFileSystem[]>([]);
    const { isDrawerOpen } = useInfoDrawerSignal();
    const isMounted: boolean = useMountedState();
    const { quizzesDb } = useQuizzesDbSignal();

    const quizData: QuizModelResponse[] = quizzesDb.value;
    const hideDrawer = !isDrawerOpen.value;

    const handleOnDrop = (draggedItemId: string, targetItemId: string) => {
        const updatedItems = [...virtualFileSystem];
        //@ts-ignore
        const draggedItemIndex = updatedItems.findIndex((item) => item?.entryId === draggedItemId);
        //@ts-ignore
        const targetItemIndex = updatedItems.findIndex((item) => item?.entryId === targetItemId);

        if (draggedItemIndex !== -1 && targetItemIndex !== -1) {
            const [draggedItem] = updatedItems.splice(draggedItemIndex, 1);
            updatedItems.splice(targetItemIndex, 0, draggedItem);
            setVirtualFileSystem(updatedItems);
            localStorage.setItem('virtualFileSystem', JSON.stringify(updatedItems));
        }
    };

    // fetches all the quizzes from the database when the drawer is open and the component is mounted
    useEffect(() => {
        if (isMounted && isDrawerOpen.value) {
            (async () => {
                await API.getAllQuizzes({
                    showTimestamps: true,
                    needToPopulate: true
                });
            })();
        }
    }, [isMounted, isDrawerOpen.value, quizData.length]);

    // if the drawer is open and the quiz data is populated, generate the virtual file system
    useEffect(() => {
        if (isMounted && isDrawerOpen.value && quizData.length > 0) {
            // retrieve virtual file system from local storage
            const virtualFileSystem: VirtualFileSystem[] = getVirtualFileSystemFromStorage();
            // generate virtual file system from quiz data and the existing virtual file system
            const tempFileSystem = generateFileSystem([...quizData as PopulatedQuizModel[]], virtualFileSystem);

            setVirtualFileSystemToStorage(tempFileSystem);
            setVirtualFileSystem(tempFileSystem);
        }
    }, [isDrawerOpen.value, quizData.length]);

    if (hideDrawer) return <></>

    return isMounted ? (
        <div className={trimClasses(drawerClasses)}>
            <DroppableArea onDrop={handleOnDrop}>
                <ul
                    tabIndex={0}
                    className={ulClasses}
                >
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
