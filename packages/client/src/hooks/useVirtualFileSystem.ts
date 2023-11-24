import { useMountedState } from '.';
import { useEffect, useState } from 'preact/hooks';
import { useInfoDrawerSignal, useQuizzesDbSignal } from '../signals';
import {
    VirtualFileSystem, QuizModelResponse, API, getVirtualFileSystemFromStorage,
    generateFileSystem, setVirtualFileSystemToStorage, PopulatedQuizModel
} from '../utils';

export type VirtualFileSystemState = { [key: string]: VirtualFileSystem };

export interface IUseVirtualFileSystem {
    virtualFileSystem: VirtualFileSystemState
    updateVirtualFileSystem: (virtualFileSystem: VirtualFileSystem[]) => void;
    setRefresh: (refresh: boolean) => void;
}

export const convertArrayToStateObject = (array: VirtualFileSystem[]): VirtualFileSystemState => {
    const temp: VirtualFileSystemState = {};
    array.forEach(entry => {
        // @ts-ignore
        temp[entry?.entryId ?? entry.name] = entry;
    });
    return temp;
};

export const convertStateObjectToArray = (stateObject: VirtualFileSystemState): VirtualFileSystem[] => {
    const temp: VirtualFileSystem[] = [];
    Object.keys(stateObject).forEach(key => {
        temp.push(stateObject[key]);
    });
    return temp;
}

export function useVirtualFileSystem() {
    const [virtualFileSystem, setVirtualFileSystem] = useState<VirtualFileSystemState>(convertArrayToStateObject(getVirtualFileSystemFromStorage()));
    const [refresh, setRefresh] = useState<boolean>(false); // eslint-disable-line @typescript-eslint/no-unused-vars
    const { isDrawerOpen } = useInfoDrawerSignal();
    const isMounted: boolean = useMountedState();
    const { quizzesDb } = useQuizzesDbSignal();


    const quizData: QuizModelResponse[] = quizzesDb.value;

    const updateVirtualFileSystem = (_virtualFileSystem: VirtualFileSystem[]) => {
        const tempObj = convertArrayToStateObject(_virtualFileSystem);
        setVirtualFileSystem(tempObj);
        // set an array of the virtual file system to storage
        setVirtualFileSystemToStorage(convertStateObjectToArray(tempObj));
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
    }, [isDrawerOpen.value, quizData.length, refresh,
    Object.keys(virtualFileSystem).length,
    Object.entries(virtualFileSystem).length]);


    return {
        setRefresh: () => setRefresh(!refresh),
        virtualFileSystem,
        updateVirtualFileSystem
    };
}
