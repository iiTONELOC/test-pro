import { useEffect, useState } from 'preact/hooks';
import { useMountedState } from '.';
import { useInfoDrawerSignal, useQuizzesDbSignal } from '../signals';
import {
    VirtualFileSystem, QuizModelResponse, API, getVirtualFileSystemFromStorage,
    generateFileSystem, setVirtualFileSystemToStorage, PopulatedQuizModel
} from '../utils';



export interface IUseVirtualFileSystem {
    virtualFileSystem: VirtualFileSystem[];
    updateVirtualFileSystem: (virtualFileSystem: VirtualFileSystem[]) => void;
    setRefresh: (refresh: boolean) => void;
}

export function useVirtualFileSystem() {
    const [virtualFileSystem, setVirtualFileSystem] = useState<VirtualFileSystem[]>(getVirtualFileSystemFromStorage());
    const [refresh, setRefresh] = useState<boolean>(false); // eslint-disable-line @typescript-eslint/no-unused-vars
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


            // generate virtual file system from quiz data and the existing virtual file system
            const tempFileSystem = generateFileSystem([...quizData as PopulatedQuizModel[]],
                getVirtualFileSystemFromStorage())
                .filter(entry => entry !== null);

            updateVirtualFileSystem(tempFileSystem);
        }
    }, [isDrawerOpen.value, quizData.length, refresh]);


    return {
        setRefresh: () => setRefresh(!refresh),
        virtualFileSystem,
        updateVirtualFileSystem
    };
}
