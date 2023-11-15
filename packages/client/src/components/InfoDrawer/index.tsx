import { trimClasses, getVirtualFileSystem, generateFileSystem } from '../../utils';
import { useInfoDrawerSignal, useQuizzesDbSignal } from '../../signals';
import { useEffect, useState } from 'preact/hooks';
import { useMountedState } from '../../hooks';

import { VirtualFile } from './VirtualFile';

import type { PopulatedQuizModel, QuizModelResponse, VirtualFileSystem, IVirtualDirectory, IVirtualFile } from '../../utils';


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

    useEffect(() => {
        if (isMounted && isDrawerOpen.value) {

            const virtualFileSystem: VirtualFileSystem[] = getVirtualFileSystem();
            const tempFileSystem = generateFileSystem([...quizData as PopulatedQuizModel[]], virtualFileSystem);

            // save the virtual file system
            localStorage.setItem('virtualFileSystem', JSON.stringify(tempFileSystem));
            setVirtualFileSystem(tempFileSystem);
        }
    }, [isMounted, isDrawerOpen.value, quizData.length]);

    if (hideDrawer) return <></>

    return isMounted ? (
        <div className={trimClasses(drawerClasses)}>
            <ul
                tabIndex={0}
                className={ulClasses}>
                {virtualFileSystem.length > 0 && virtualFileSystem.map((entry: VirtualFileSystem, index: number) => (
                    <VirtualFile key={`${entry.name}-${index}`} file={entry as IVirtualFile} />// NOSONAR
                ))}

                {virtualFileSystem.length === 0 &&
                    <li className={liClasses}>No Quizzes Found!</li>
                }
            </ul>
        </div>
    ) : <></>
}

export default InfoDrawer;

export { InfoDrawerToggler } from './InfoDrawerToggler';
