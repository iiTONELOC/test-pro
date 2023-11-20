import { useMountedState } from '.';
import { useState, useEffect } from 'preact/hooks';
import { useInfoDrawerSignal, useQuizzesDbSignal } from '../signals';
import {
    VirtualFileSystem, QuizModelResponse, API, getVirtualFileSystemFromStorage,
    generateFileSystem, setVirtualFileSystemToStorage, PopulatedQuizModel
} from '../utils';

export interface IUseVirtualFileSystem {
    virtualFileSystem: VirtualFileSystem[];
    updateVirtualFileSystem: (virtualFileSystem: VirtualFileSystem[]) => void;
}

export function useVirtualFileSystem() {
    const [virtualFileSystem, setVirtualFileSystem] = useState<VirtualFileSystem[]>([]);
    const { isDrawerOpen } = useInfoDrawerSignal();
    const isMounted: boolean = useMountedState();
    const { quizzesDb } = useQuizzesDbSignal();

    const quizData: QuizModelResponse[] = quizzesDb.value;

    const updateVirtualFileSystem = (virtualFileSystem: VirtualFileSystem[]) => {
        //set local component state
        setVirtualFileSystem(virtualFileSystem);
        //set local storage
        setVirtualFileSystemToStorage(virtualFileSystem);
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

            updateVirtualFileSystem(tempFileSystem);
        }
    }, [isDrawerOpen.value, quizData.length]);


    return {
        virtualFileSystem,
        updateVirtualFileSystem
    };
}
