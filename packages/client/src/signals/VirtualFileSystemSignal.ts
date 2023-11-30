
import { signal, Signal } from '@preact/signals';
import {
    API, convertArrayToStateObject, createVfsObject,
    toJsonObj, VirtualFileSystem
} from '../utils';


export type VirtualFileSystemState = { [key: string]: VirtualFileSystem };
export const virtualFileSystemSignal: Signal<VirtualFileSystemState> = signal({});

export interface IUseVirtualFileSystemSignal {
    virtualFileSystem: Signal<VirtualFileSystemState>;
    updateVirtualFileSystem: (virtualFileSystem: VirtualFileSystem[]) => void;
}


export const useVirtualFileSystemSignal = (): IUseVirtualFileSystemSignal => {
    const updateVirtualFileSystem = async (_virtualFileSystem: VirtualFileSystem[]) => {
        // update the virtual file system's local state
        const tempObj = convertArrayToStateObject(_virtualFileSystem);
        virtualFileSystemSignal.value = tempObj;

        // update the virtual file system stored on the server
        const updatedVfs = createVfsObject(tempObj)
        await API.updateVfs(toJsonObj(updatedVfs));
    };

    return {
        virtualFileSystem: virtualFileSystemSignal,
        updateVirtualFileSystem
    };
};
