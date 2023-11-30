import { JSX } from 'preact/jsx-runtime';
import { useMountedState } from '../../hooks';
import { DrawerActionButtons } from './DrawerActionButtons';
import { useEffect, useMemo } from 'preact/hooks';
import { DroppableArea, handleOnDrop } from '../DragAndDrop';
import { VirtualFileSystemComponent } from '../VirtualFileSystem';
import { useInfoDrawerSignal, useQuizzesDbSignal, useVirtualFileSystemSignal } from '../../signals';
import {
    trimClasses, convertStateObjectToArray, generateFileSystem, getVirtualFileSystem, API,
    QuizModelResponse, PopulatedQuizModel
} from '../../utils';

const drawerClasses = `bg-gray-950/[.75] h-full w-1/3 lg:w-1/4 xl:w-1/6 p-1 truncate text-xs 
sm:text-sm lg:text-md xl:text-base flex flex-col justify-start`;

const liClasses = 'text-center text-gray-500';

export function InfoDrawer(): JSX.Element {
    const { virtualFileSystem, updateVirtualFileSystem } = useVirtualFileSystemSignal();
    const { isDrawerOpen } = useInfoDrawerSignal();
    const isMounted: boolean = useMountedState();
    const { quizzesDb } = useQuizzesDbSignal();

    const hideDrawer = !isDrawerOpen.value;
    const quizData: QuizModelResponse[] = quizzesDb.value;

    const vfsArray = useMemo(() => convertStateObjectToArray(virtualFileSystem.value), [virtualFileSystem.value]);

    const dropHandler = (draggedItemId: string, targetItemId: string) =>
        handleOnDrop({
            draggedItemId,
            targetItemId,
            updateVirtualFileSystem,
            virtualFileSystem: vfsArray
        });

    // fetch quiz data from the database, this will update the quizzesDb signal
    useEffect(() => {
        if (isMounted && isDrawerOpen.value) {
            (async () => {
                try {
                    await API.getAllQuizzes({
                        showTimestamps: true,
                        needToPopulate: true
                    });
                } catch (error) {
                    console.error(error);
                }

            })();
        }
    }, [isMounted, isDrawerOpen.value]);

    // if the quizSignal has been updated, update the virtual file system
    useEffect(() => {
        if (isMounted && isDrawerOpen.value && quizData.length > 0) {
            (async () => {
                const tempFileSystem = generateFileSystem([...quizData as PopulatedQuizModel[]],
                    await getVirtualFileSystem())
                    .filter(entry => entry !== null);

                updateVirtualFileSystem(tempFileSystem);
            })();
        }
    }, [quizData.length]);


    if (hideDrawer) return <></>

    return (
        <div className={trimClasses(drawerClasses)}>
            <DrawerActionButtons />
            {Object.keys(virtualFileSystem).length === 0 &&
                <p className={liClasses}>No Quizzes Found!</p>
            }
            <DroppableArea onDrop={dropHandler} id={'__root__'}>
                <VirtualFileSystemComponent
                    virtualFileSystem={vfsArray}
                    dropHandler={dropHandler}
                />
                <div data-id='__root__' className={'invisible w-full bock h-16'}> </div>
            </DroppableArea>
        </div>
    )
}

export default InfoDrawer;
export { InfoDrawerToggler } from './InfoDrawerToggler';
