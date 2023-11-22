import { IVirtualDirectory, IVirtualFile, VirtualFileSystem, findFileInVfs, findFolderInVfs } from '../virtualFileSystem';


export interface IMoveHandlerParams {
    virtualFileSystem: VirtualFileSystem[];
    draggedItemId: string;
    targetItemId: string;
}

export type IMoveHandler = (params: IMoveHandlerParams) => {
    virtualFileSystem: VirtualFileSystem[]; foldersToReOpen: string[]
};


/**
 * Handles the move file to folder event
 * @param virtualFileSystem the virtual file system to update
 * @param draggedItemId the id of the item being dragged
 * @param targetItemId the id of the item being dragged to
 * @returns the updated virtual file system
 */
export function handleMoveFileToFolder({ virtualFileSystem, draggedItemId, targetItemId }:
    IMoveHandlerParams): ReturnType<IMoveHandler> {

    const foldersToReOpen = [];
    const updated = [...virtualFileSystem];
    const { containingFolder } = findFileInVfs(updated, draggedItemId);
    const draggedItem = findFileInVfs(updated, draggedItemId).found as IVirtualFile;

    draggedItem && (() => {
        // handle the case where the dragged item is in the root of the virtual file system
        const removed = !containingFolder ? updated.splice(updated.indexOf(draggedItem), 1).pop() :
            // @ts-ignore
            containingFolder?.children?.splice(containingFolder?.children?.indexOf(draggedItem), 1).pop();
        if ((containingFolder?.children?.length ?? 0) > 0) foldersToReOpen.push(containingFolder?.name ?? '');
        // find the location of the targetItemId in the virtualFileSystem
        const targetFolder = findFolderInVfs(updated, targetItemId).found as IVirtualDirectory;
        if ((targetFolder?.children?.length ?? 0) > 0) foldersToReOpen.push(targetFolder?.name ?? '');
        // look for the children property on the target folder
        // @ts-ignore
        const targetFolderChildren = targetFolder?.children ?? null;

        if (!targetFolder) {
            // if there is no target folder then we are moving the dragged item to the root
            removed && updated.push(removed);
        } else {
            // if there is a target folder with children then add the dragged item to it
            // @ts-ignore
            removed && targetFolderChildren?.push(removed);
            // if there was no target folder then we are moving the dragged item to the root
            removed && !targetFolderChildren && updated.push(removed);
        }
    })();


    return { virtualFileSystem: updated, foldersToReOpen };
}



export function handleMoveFileToFile({ virtualFileSystem, draggedItemId, targetItemId }:
    IMoveHandlerParams): ReturnType<IMoveHandler> {

    const updated = [...virtualFileSystem];
    const { containingFolder: targetContainingFolder } = findFolderInVfs(virtualFileSystem, targetItemId);
    const { containingFolder: draggedContainingFolder } = findFolderInVfs(virtualFileSystem, draggedItemId);


    // if the folder names are the same, then we are moving the dragged item to the same folder but possibly a different position
    if (draggedContainingFolder?.name === targetContainingFolder?.name) {
        if (draggedContainingFolder?.name === undefined && targetContainingFolder?.name === undefined) {

            // move the dragged item from the root to the targetItems children
            // @ts-ignore
            const itemToMove: VirtualFileSystem | undefined = updated.find(item => item?.entryId === draggedItemId);

            // remove the itemToMove from the virtualFileSystem's root
            // @ts-ignore
            const removed: IVirtualFile | undefined = updated.splice(updated.indexOf(itemToMove), 1).pop();

            // find the target folder
            const targetFolder: IVirtualDirectory = findFolderInVfs(updated, targetItemId).found as IVirtualDirectory;

            // handles root to root
            if (targetFolder === undefined && targetContainingFolder === undefined) {
                // find the items original index in the root
                // @ts-ignore
                const itemToMoveIndex = virtualFileSystem.indexOf(itemToMove);
                //@ts-ignore
                const targetItemIndex = virtualFileSystem.findIndex(item => item?.entryId === targetItemId);
                // place the itemToMove in the root at the targetItemIndex
                // @ts-ignore
                updated.splice(targetItemIndex, 0, removed);
            } else {

                if (!targetFolder) {
                    // @ts-ignore
                    updated.splice(updated.indexOf(itemToMove), 0, removed);
                } else {
                    // move the itemToMove to the target folder
                    itemToMove && targetFolder?.children?.push(removed as IVirtualFile);
                }

            }
        } else {
            console.log('SAME FOLDER - NOT HANDLED');
        }
    } else {
        // move the dragged item out of its containing folder and to the target folder
        // @ts-ignore
        const draggedItemFromFolder: VirtualFileSystem | undefined = findFileInVfs(draggedContainingFolder, draggedItemId);

        // place it in the target folder
        // @ts-ignore
        draggedItemFromFolder && targetContainingFolder?.children?.push(draggedItemFromFolder);

        // remove it from its containing folder
        // @ts-ignore
        draggedItemFromFolder && draggedContainingFolder?.children?.splice(draggedContainingFolder?.children?.indexOf(draggedItemFromFolder), 1);
    }

    return { virtualFileSystem: updated, foldersToReOpen: [] };
}

export function handleMoveFolderToFolder({ virtualFileSystem, draggedItemId, targetItemId }: IMoveHandlerParams) {
    const updated = [...virtualFileSystem];
    let targetFolderName: string | undefined = undefined;

    // if moving to the root folder
    if (targetItemId === '__root__') {
        // we need to look for the dragged item in the virtual file system, it could be at root or in another folder
        const { found, containingFolder } = findFolderInVfs(updated, draggedItemId);

        // remove the dragged item from the foundsContainingFolder and place it in the root
        // @ts-ignore
        const removed = containingFolder?.children?.splice(containingFolder?.children?.indexOf(found), 1)[0];

        // // @ts-ignore
        removed && found && updated.push(removed);
        targetFolderName = '__root__';

        // not moving to the root
    } else {
        const targetFolder: IVirtualDirectory | undefined = findFolderInVfs(updated, targetItemId).found as IVirtualDirectory;
        const { found, containingFolder } = findFolderInVfs(updated, draggedItemId);


        if (!found && draggedItemId !== targetItemId) {
            const draggedItem = findFolderInVfs(updated, draggedItemId);
            console.log('NOT IMPLEMENTED FOLDER to FOLDER missing targetItemID', { draggedItem });
        }

        if (containingFolder?.name === targetFolder?.name) {
            // same directory
            console.log('same directory - NOT IMPLEMENTED');

        } else if (draggedItemId === targetItemId) {
            // different directory
            console.log('same directory - NOT IMPLEMENTED');

        }
        else {
            if (!containingFolder) {
                //item is in the root

                // move the found item to the target folder's children
                // @ts-ignore
                const removed = found && updated.splice(updated.indexOf(found), 1)[0];
                // @ts-ignore
                removed && targetFolder?.children?.push(removed);
            } else {
                console.log('item is in a folder - NOT IMPLEMENTED');

            }
        }
    }
    return { virtualFileSystem: updated, foldersToReOpen: [targetFolderName ?? ''] };
}


export function handleMoveFolderToFile({ virtualFileSystem, draggedItemId, targetItemId }: IMoveHandlerParams) {
    console.log('handleMoveFolderToFile');
    const updated = [...virtualFileSystem];

    let targetFolderName: string | undefined = undefined;
    const targetFolder: IVirtualDirectory | undefined = findFolderInVfs(updated, targetItemId).found as IVirtualDirectory;
    const { found, containingFolder } = findFolderInVfs(updated, draggedItemId);


    if (!containingFolder && !targetFolder) {
        // root to root move
        // we need to find the the index of the dragged item in the virtual file system
        // @ts-ignore
        const draggedItemIndex = virtualFileSystem.findIndex(item => item?.name === draggedItemId);
        // @ts-ignore
        const targetIndex = virtualFileSystem.findIndex(item => item?.entryId === targetItemId);
        console.log({ draggedItemIndex, targetIndex });

        const copy = [...virtualFileSystem];

        if (draggedItemIndex !== -1 && targetIndex !== -1) {
            // we need to move the dragged item to the target index
            updated[draggedItemIndex] = copy[targetIndex];
            updated[targetIndex] = copy[draggedItemIndex];
        } else {
            console.log('FOLDER TO FILE UNKNOWN INDEXES', { draggedItemIndex, targetIndex });
        }




    } else {
        console.log('NOT IMPLEMENTED - folder to file with containing and target folders');
        console.log({ found, containingFolder, targetFolder, updated, draggedItemId, targetItemId, targetFolderName, virtualFileSystem });

    }

    return { virtualFileSystem: updated, foldersToReOpen: [targetFolderName ?? ''] };
}



export { dropController } from './dropController';
export type { IDropControllerParams } from './dropController';
