
import { signal, Signal } from '@preact/signals';
import {
    API, convertArrayToStateObject, createVfsObject,
    toJsonObj, VirtualFileSystem, VirtualFileSystemState
} from '../utils';


export const virtualFileSystemSignal: Signal<VirtualFileSystemState> = signal(
    JSON.parse(localStorage.getItem('virtualFileSystem') ?? '{}'));

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

        // update the virtual file system stored in local storage
        localStorage.setItem('virtualFileSystem', JSON.stringify(tempObj));
    };

    return {
        virtualFileSystem: virtualFileSystemSignal,
        updateVirtualFileSystem
    };
};
