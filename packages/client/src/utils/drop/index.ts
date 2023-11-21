import { IVirtualDirectory, IVirtualFile, VirtualFileSystem } from '../virtualFileSystem';

function getFoldersFromVirtualFileSystem(virtualFileSystem: VirtualFileSystem[]) {
    // @ts-ignore
    return virtualFileSystem.filter(item => item?.children);
}

function findContainingFolder(virtualFileSystem: VirtualFileSystem[], itemId: string) {
    const folders: VirtualFileSystem[] = getFoldersFromVirtualFileSystem(virtualFileSystem);

    return folders.find(
        // @ts-ignore
        folder => folder?.children?.find(item => item?.entryId === itemId));
}

function findItemInContainingFolder(containingFolder: IVirtualDirectory, itemId: string) {
    // @ts-ignore
    return containingFolder?.children?.find(item => item?.entryId === itemId);
}

export interface IMoveHandlerParams {
    virtualFileSystem: VirtualFileSystem[];
    draggedItemId: string;
    targetItemId: string;
}


function generateFoldersToOpen(virtualFileSystem: VirtualFileSystem[], draggedItemId: string, targetItemId: string) {
    const foldersToOpen: string[] = [];
    const draggedItemContainingFolder: VirtualFileSystem | undefined = findContainingFolder(virtualFileSystem, draggedItemId);
    const targetItemContainingFolder: VirtualFileSystem | undefined = findContainingFolder(virtualFileSystem, targetItemId);

    // @ts-ignore
    const draggedItemContainingFolderHasChildren = draggedItemContainingFolder?.children?.length ?? 0;
    // @ts-ignore
    const targetItemContainingFolderHasChildren = targetItemContainingFolder?.children?.length ?? 0;

    if (draggedItemContainingFolderHasChildren > 0) foldersToOpen.push(draggedItemContainingFolder?.name ?? '');
    if (targetItemContainingFolderHasChildren > 0) foldersToOpen.push(targetItemContainingFolder?.name ?? '');


    return foldersToOpen;
}

export type IMoveHandler = (params: IMoveHandlerParams) => { virtualFileSystem: VirtualFileSystem[]; foldersToReOpen: string[] };


/**
 * Handles the move file to folder event
 * @param virtualFileSystem the virtual file system to update
 * @param draggedItemId the id of the item being dragged
 * @param targetItemId the id of the item being dragged to
 * @returns the updated virtual file system
 */
export function handleMoveFileToFolder({ virtualFileSystem, draggedItemId, targetItemId }: IMoveHandlerParams): ReturnType<IMoveHandler> {
    const updated = [...virtualFileSystem];

    // find the location of the draggedItemId in the virtualFileSystem
    // @ts-ignore
    const folders: VirtualFileSystem[] = getFoldersFromVirtualFileSystem(updated);

    const containingFolder: VirtualFileSystem | undefined = findContainingFolder(updated, draggedItemId);

    // look for the dragged item in the containing folder
    // @ts-ignore
    const draggedItemFromFolder: VirtualFileSystem | undefined = findItemInContainingFolder(containingFolder, draggedItemId);
    // if there is no containing folder for the dragged item then it must be in the root
    // @ts-ignore
    const draggedItemFromRoot: VirtualFileSystem | undefined = updated.find(item => item?.entryId === draggedItemId);
    const draggedItem = draggedItemFromFolder ?? draggedItemFromRoot ?? null;

    // if we can't find the dragged item then throw an error, but this should never happen
    if (!draggedItem) throw new Error('Dragged item not found');

    // handle the case where the dragged item is in the root of the virtual file system
    const removed = !containingFolder ? updated.splice(updated.indexOf(draggedItem), 1).pop() :
        // @ts-ignore
        containingFolder?.children?.splice(containingFolder?.children?.indexOf(draggedItem), 1).pop();

    // find the location of the targetItemId in the virtualFileSystem
    const targetFolder = folders.find(folder => folder.name === targetItemId) ?? null;
    // look for the children property on the target folder
    // @ts-ignore
    const targetFolderChildren = targetFolder?.children ?? null;

    if (!targetFolder) {
        console.log('target folder not found, moving to root');
        // if there is no target folder then we are moving the dragged item to the root
        removed && updated.push(removed);
    } else {
        // if there is a target folder with children then add the dragged item to it
        // @ts-ignore
        removed && targetFolderChildren?.push(removed);
        // if there was no target folder then we are moving the dragged item to the root
        removed && !targetFolderChildren && updated.push(removed);
    }
    return { virtualFileSystem: updated, foldersToReOpen: generateFoldersToOpen(updated, draggedItemId, targetItemId) };
}



export function handleMoveFileToFile({ virtualFileSystem, draggedItemId, targetItemId }: IMoveHandlerParams): ReturnType<IMoveHandler> {
    const updated = [...virtualFileSystem];
    const targetContainingFolder: VirtualFileSystem | undefined = findContainingFolder(virtualFileSystem, targetItemId);
    const draggedContainingFolder: VirtualFileSystem | undefined = findContainingFolder(virtualFileSystem, draggedItemId);


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
            const targetFolder: IVirtualDirectory = updated.find(folder => folder.name === targetItemId) as IVirtualDirectory;


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
                // move the itemToMove to the target folder
                itemToMove && targetFolder?.children?.push(removed as IVirtualFile);
            }
        } else {
            console.log('SAME FOLDER - NOT HANDLED');
        }
    } else {
        // move the dragged item out of its containing folder and to the target folder
        // @ts-ignore
        const draggedItemFromFolder: VirtualFileSystem | undefined = findItemInContainingFolder(draggedContainingFolder, draggedItemId);

        // place it in the target folder
        // @ts-ignore
        draggedItemFromFolder && targetContainingFolder?.children?.push(draggedItemFromFolder);

        // remove it from its containing folder
        // @ts-ignore
        draggedItemFromFolder && draggedContainingFolder?.children?.splice(draggedContainingFolder?.children?.indexOf(draggedItemFromFolder), 1);
    }

    return { virtualFileSystem: updated, foldersToReOpen: generateFoldersToOpen(updated, draggedItemId, targetItemId) };
}


function findFolderInFS(
    virtualFileSystem: VirtualFileSystem[],
    folderName: string,
    draggedItemId?: string
): { found: VirtualFileSystem | null; containingFolder: VirtualFileSystem | null } {
    let found: VirtualFileSystem | null = null;
    let containingFolder: VirtualFileSystem | null = null;

    for (const folder of virtualFileSystem) {
        if (folder.name === folderName) {
            found = folder;
            containingFolder = null;
            break;
        } else {
            // @ts-ignore
            const didFind = folder?.children?.find(item => item?.name === draggedItemId);
            if (didFind) {
                found = didFind;
                containingFolder = folder;
                break;
            } else {
                // we need to look in the children of this folder for any folders and recurse down
                // @ts-ignore
                const folders = folder?.children?.filter(item => item?.children);
                if (folders) {
                    const { found: foundInFolder, containingFolder: containingFolderInFolder } = findFolderInFS(folders, folderName, draggedItemId);
                    if (foundInFolder) {
                        found = foundInFolder;
                        containingFolder = containingFolderInFolder;
                        break;
                    }
                }
            }
        }
    }

    return { found, containingFolder };
}


export function handleMoveFolderToFolder({ virtualFileSystem, draggedItemId, targetItemId }: IMoveHandlerParams) {
    const updated = [...virtualFileSystem];
    let targetFolderName: string | undefined = undefined;

    // if moving to the root folder
    if (targetItemId === '__root__') {
        // we need to look for the dragged item in the virtual file system, it could be at root or in another folder
        const folders: VirtualFileSystem[] = getFoldersFromVirtualFileSystem(updated);

        let { found, containingFolder } = findFolderInFS(folders, draggedItemId);

        for (const folder of folders) {
            if (folder.name === draggedItemId) {
                found = folder;
                containingFolder = null;
                break;
            } else {
                // @ts-ignore
                found = folder?.children?.find(item => item?.name === draggedItemId);
                containingFolder = folder;
            }
        }

        // remove the dragged item from the foundsContainingFolder and place it in the root
        // @ts-ignore
        const removed = containingFolder?.children?.splice(containingFolder?.children?.indexOf(found), 1)[0];

        // // @ts-ignore
        removed && found && updated.push(removed);
        targetFolderName = '__root__';

        // not moving to the root
    } else {
        const targetFolder: IVirtualDirectory | undefined = findFolderInFS(updated, targetItemId, draggedItemId).found as IVirtualDirectory;
        let { found, containingFolder } = findFolderInFS(updated, draggedItemId, targetItemId);


        if (!found && draggedItemId !== targetItemId) {
            const draggedItem = findFolderInFS(updated, draggedItemId, targetItemId);
            console.log({ draggedItem });
        }

        if (containingFolder?.name === targetFolder?.name) {
            // same directory
            console.log('same directory - NOT IMPLEMENTED');

        } else if (draggedItemId === targetItemId) {
            // different directory
            console.log('same directory - NOT IMPLEMENTED');

        }
        else {
            console.log('different directory')

            if (!containingFolder) {
                //item is in the root
                console.log('item is in the root');

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




export { dropController } from './dropController';
export type { IDropControllerParams } from './dropController';
