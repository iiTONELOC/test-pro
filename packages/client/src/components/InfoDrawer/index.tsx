import { getVirtualFileSystem, generateFileSystem } from '../../utils/virtualFileSystem';
import { useSelectedFileState } from '../../signals';
import { useEffect, useState } from 'preact/hooks';
import { useMountedState } from '../../hooks';
import { trimClasses } from '../../utils/';
import { VirtualFile } from './VirtualFile';

export type InfoDrawerProps = {
    isOpen: boolean;
    quizData: QuizModelResponse[];
}

import type { PopulatedQuizModel, QuizModelResponse } from '../../utils/api';
import type { VirtualFileSystem, IVirtualDirectory, IVirtualFile } from '../../utils/virtualFileSystem';


const drawerClasses = `bg-gray-950/[.75] h-[calc(100vh-44px)] w-1/3 lg:w-1/4 xl:w-1/6 p-1 truncate text-xs 
sm:text-sm lg:text-md xl:text-base flex`;


export function InfoDrawer({ isOpen, quizData }: Readonly<InfoDrawerProps>): JSX.Element {
    const [virtualFileSystem, setVirtualFileSystem] = useState<VirtualFileSystem[]>([]);
    const { setSelectedFile } = useSelectedFileState();
    const [loadedVFS, setLoadedVFS] = useState<boolean>(false);
    const isMounted: boolean = useMountedState();

    const hideDrawer = !isOpen;


    const handleClick = (e: Event) => {
        e.stopPropagation();
        e.preventDefault();
        setSelectedFile('');
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.stopPropagation();
            e.preventDefault();
            setSelectedFile('');
        }
    }

    useEffect(() => {
        if (isMounted && isOpen && !loadedVFS) {
            const virtualFileSystem: VirtualFileSystem[] = getVirtualFileSystem();
            const tempFileSystem = generateFileSystem([...quizData as PopulatedQuizModel[]], virtualFileSystem);

            // save the virtual file system
            localStorage.setItem('virtualFileSystem', JSON.stringify(tempFileSystem));
            setVirtualFileSystem(tempFileSystem);
            setLoadedVFS(true);
        }
    }, [isMounted, isOpen]);

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
