import { VirtualFileSystem, getItemIdOrFolderName, setVirtualFileSystemToStorage } from '../../utils';


export const handleOnDrop = (draggedItemId: string, targetItemId: string,
    virtualFileSystem: VirtualFileSystem[], setVirtualFileSystem: (virtualFileSystem: VirtualFileSystem[]) => void) => {
    // make a copy of the virtual file system so we can update the dragged item's position
    const updatedItems = [...virtualFileSystem];
    //@ts-ignore
    const startingIndex = updatedItems.findIndex((item) => getItemIdOrFolderName(item) === draggedItemId);
    //@ts-ignore
    const endingIndex = updatedItems.findIndex((item) => getItemIdOrFolderName(item) === targetItemId);

    if (startingIndex !== -1 && endingIndex !== -1) {
        const [draggedItem] = updatedItems.splice(startingIndex, 1);
        updatedItems.splice(endingIndex, 0, draggedItem);
        setVirtualFileSystemToStorage(virtualFileSystem);
        setVirtualFileSystem(updatedItems);
    }
};
