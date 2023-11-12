import { trimClasses, getVirtualFileSystem, generateFileSystem, clickHandler, keyHandler } from '../../utils';
import { useSelectedFileState, useInfoDrawerState } from '../../signals';
import { useEffect, useState } from 'preact/hooks';
import { useMountedState } from '../../hooks';

import { VirtualFile } from './VirtualFile';

import type { PopulatedQuizModel, QuizModelResponse, VirtualFileSystem, IVirtualDirectory, IVirtualFile } from '../../utils';

export type InfoDrawerProps = {
    quizData: QuizModelResponse[];
}

const drawerClasses = `bg-gray-950/[.75] h-[calc(100vh-44px)] w-1/3 lg:w-1/4 xl:w-1/6 p-1 truncate text-xs 
sm:text-sm lg:text-md xl:text-base flex`;


export function InfoDrawer({ quizData }: Readonly<InfoDrawerProps>): JSX.Element {
    const [virtualFileSystem, setVirtualFileSystem] = useState<VirtualFileSystem[]>([]);
    const [loadedVFS, setLoadedVFS] = useState<boolean>(false);
    const { setSelectedFile } = useSelectedFileState();
    const { isDrawerOpen } = useInfoDrawerState();
    const isMounted: boolean = useMountedState();
    const hideDrawer = !isDrawerOpen.value;

    const resetSelectedFile = () => setSelectedFile('');
    const handleClick = (event: MouseEvent) => {
        clickHandler({ event, callback: resetSelectedFile, stopPropagation: true });
    };

    const handleKeyDown = (event: KeyboardEvent) => {
        keyHandler({ event, keyToWatch: 'Enter', direction: 'down', callback: resetSelectedFile, stopPropagation: true });
    };

    useEffect(() => {
        if (isMounted && isDrawerOpen.value && !loadedVFS) {
            const virtualFileSystem: VirtualFileSystem[] = getVirtualFileSystem();
            const tempFileSystem = generateFileSystem([...quizData as PopulatedQuizModel[]], virtualFileSystem);

            // save the virtual file system
            localStorage.setItem('virtualFileSystem', JSON.stringify(tempFileSystem));
            setVirtualFileSystem(tempFileSystem);
            setLoadedVFS(true);
        }
    }, [isMounted, isDrawerOpen.value]);

    if (hideDrawer) return <></>

    return isMounted && loadedVFS ? (
        <div className={trimClasses(drawerClasses)}>
            <ul
                tabIndex={0}
                onClick={handleClick}
                onKeyDown={handleKeyDown}
                className={'bg-gray-900 w-full h-full overflow-y-auto p-3 rounded-sm'}>
                {virtualFileSystem.length > 0 && virtualFileSystem.map((entry: VirtualFileSystem, index: number) => (
                    <VirtualFile key={`${entry.name}-${index}`} file={entry as IVirtualFile} />// NOSONAR
                ))}

                {virtualFileSystem.length === 0 &&
                    <li className={'text-center text-gray-500'}>No Quizzes Found!</li>
                }
            </ul>
        </div>
    ) : <></>
}
