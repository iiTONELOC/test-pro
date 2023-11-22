import { handleMoveFileToFile, handleMoveFileToFolder, handleMoveFolderToFile, handleMoveFolderToFolder } from '.';
import { VirtualFileSystem } from '../virtualFileSystem';

export interface IDropControllerParams {
    draggedItemId: string;
    targetItemId: string;
    virtualFileSystem: VirtualFileSystem[];
    updateVirtualFileSystem: (virtualFileSystem: VirtualFileSystem[]) => void;
}

function reOpenFolders(folderToReOpen: string[]): void {
    for (const folder of folderToReOpen) {
        if (!folder || folder.trim() === '') return;
        setTimeout(() => {
            // Look for a p element in the dom with a data-id attribute equal to the updated folder value and
            const p = document.querySelector(`p[data-id="${folder}"].text-base`);
            if (p instanceof HTMLParagraphElement) {
                p.click();
            }
        }, 10);
    }
}

export function dropController({ draggedItemId, targetItemId, virtualFileSystem, updateVirtualFileSystem }: IDropControllerParams) {
    // make a copy of the virtual file system so we can update the dragged item's position
    const updatedItems = [...virtualFileSystem];

    const isUUID = (id: string) => id?.length === 24 && /^[0-9a-fA-F]{24}$/.test(id);

    const targetIsUUID = isUUID(targetItemId);
    const draggedItemIsUUID = isUUID(draggedItemId);


    if (!draggedItemIsUUID && !targetIsUUID) {
        console.log('MOVING FOLDER TO FOLDER')
        const updated = handleMoveFolderToFolder({ virtualFileSystem: updatedItems, draggedItemId, targetItemId });
        updateVirtualFileSystem(updated.virtualFileSystem);
        reOpenFolders(updated.foldersToReOpen);
        return
    } else if (!draggedItemIsUUID && targetIsUUID) {
        console.log('MOVING FOLDER TO FILE')
        const updated = handleMoveFolderToFile({ virtualFileSystem: updatedItems, draggedItemId, targetItemId });
        updateVirtualFileSystem(updated.virtualFileSystem);
        reOpenFolders(updated.foldersToReOpen);
        return
    } else if (draggedItemIsUUID && !targetIsUUID) {
        console.log('MOVING FILE TO FOLDER')
        const updated = handleMoveFileToFolder({ virtualFileSystem: updatedItems, draggedItemId, targetItemId });
        updateVirtualFileSystem(updated.virtualFileSystem);
        reOpenFolders(updated.foldersToReOpen);
        return
    } else if (draggedItemIsUUID && targetIsUUID) {
        console.log('MOVING FILE TO FILE')
        const updated = handleMoveFileToFile({ virtualFileSystem: updatedItems, draggedItemId, targetItemId });
        updateVirtualFileSystem(updated.virtualFileSystem);
        reOpenFolders(updated.foldersToReOpen);
        return
    } else {
        console.log('MOVING ITEM UNKNOWN');
        return
    }
}