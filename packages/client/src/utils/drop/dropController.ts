import { IVirtualDirectory, VirtualFileSystem, findFileInVfs, findFolderInVfs } from '../virtualFileSystem';

export interface IDropControllerParams {
    draggedItemId: string;
    targetItemId: string;
    virtualFileSystem: VirtualFileSystem[];
    updateVirtualFileSystem: (virtualFileSystem: VirtualFileSystem[]) => void;
}

type ItemSearchResults = {
    found: VirtualFileSystem | null;
    containingFolder: VirtualFileSystem | null;
}

interface IMoveDraggedToFolderParams {
    draggedItemIsFolder: boolean;
    removed: VirtualFileSystem[];
    updatedItems: VirtualFileSystem[];
    foundTargetItem: VirtualFileSystem | null;
    targetItem: ItemSearchResults;
}

interface IMoveDraggedToFileParams {
    targetItemsIndex: number;
    draggedItemIsFolder: boolean;
    removed: VirtualFileSystem[];
    updatedItems: VirtualFileSystem[];
    foundTargetItemContainingFolder: VirtualFileSystem | null;
}

interface IHandleMovementParams {
    draggedItemsIndex: number;
    targetItemsIndex: number;
    draggedItemIsFolder: boolean;
    targetItem: ItemSearchResults;
    draggedItem: ItemSearchResults;
    updatedItems: VirtualFileSystem[];
    foundDraggedItem: VirtualFileSystem | null;
    foundTargetItem: VirtualFileSystem | null;
    foundDraggedItemContainingFolder: VirtualFileSystem | null;
    foundTargetItemContainingFolder: VirtualFileSystem | null;
    updateVirtualFileSystem: (virtualFileSystem: VirtualFileSystem[]) => void;
}


/**
 * Returns the index of the item in the virtual file system, this index is relative to the containing folder
 * 
 * @param updatedItems a copy of the virtual file system
 * @param itemIsFolder  whether the item is a folder or not
 * @param foundItem the item we are looking for
 * @param foundItemContainingFolder the folder that contains the item we are looking for
 * @returns the relative index of the item in the containing folder or -1 if the item is not found
 */
const getItemIndex = (
    updatedItems: VirtualFileSystem[],
    itemIsFolder: boolean,
    foundItem: VirtualFileSystem | null,
    foundItemContainingFolder: VirtualFileSystem | null
): number => {
    return foundItemContainingFolder === null ? updatedItems
        // @ts-ignore
        .findIndex(item => itemIsFolder ? item.name === foundItem?.name : item?.entryId === foundItem?.entryId) :
        // @ts-ignore
        foundItemContainingFolder?.children.findIndex(item => itemIsFolder ? item.name === foundItem?.name : item?.entryId === foundItem?.entryId);
}


/**
 * Locates the item in the virtual file system
 * 
 * @param itemIsFolder whether the item is a folder or not
 * @param itemId the id of the item we are looking for (if this is a folder then this is the folder name)
 * @param virtualFileSystem a copy of the virtual file system to search
 * @returns 
 */
const findItemInVfs = (itemIsFolder: boolean, itemId: string, virtualFileSystem: VirtualFileSystem[]): {
    found: VirtualFileSystem | null;
    containingFolder: VirtualFileSystem | null;
} => {
    return itemIsFolder ?
        findFolderInVfs([...virtualFileSystem], itemId) :
        findFileInVfs([...virtualFileSystem], itemId);
}

/**
 * Determines if the dragged item is a descendant of the target item
 * 
 * @param parent the target item
 * @param child the dragged item
 * @returns true or false depending on whether the dragged item is a descendant of the target item
 */
function isDescendant(parent: IVirtualDirectory, child: IVirtualDirectory): boolean {
    if (parent.children) {
        for (const element of parent?.children) {
            let entry = element;
            if (entry?.name === child?.name) {
                return true;
            }
            // @ts-ignore
            if (entry?.children && isDescendant(entry, child)) {
                return true;
            }
        }
    }
    return false;
}
/**
 * Handles moving the dragged item to the folder it is being dropped on
 *
 * @param draggedItemIsFolder whether the dragged item is a folder or not
 * @param removed the dragged item that has been removed from the virtual file system
 * @param updatedItems a copy of the virtual file system
 * @param foundTargetItem the target item we are moving the dragged item to
 * @param targetItem object containing the target item and the containing folder of the target item
 * @returns an updated copy of the virtual file system
 */
function moveDraggedToFolder({
    removed,
    targetItem,
    updatedItems,
    foundTargetItem,
    draggedItemIsFolder
}: IMoveDraggedToFolderParams): VirtualFileSystem[] {


    if (draggedItemIsFolder) {
        // @ts-ignore
        foundTargetItem?.children && foundTargetItem?.children?.push(removed[0]);
        // @ts-ignore
        !foundTargetItem?.children && updatedItems.push(removed[0]);
    } else {
        // it is possible that the targetItem is null and the containing folder is null,
        // this means we are moving the dragged item to the root folder
        (foundTargetItem === null && targetItem.containingFolder === null) ?
            // @ts-ignore
            updatedItems.push(removed[0]) :
            // @ts-ignore
            foundTargetItem?.children?.push(removed[0]);
    }

    // need to figure out which folders to reopen, we need to reopen the dragged item's containing folder if it has children
    // and the target item's containing folder if it has children,


    return updatedItems;
}



/**
 * Handles moving the dragged item to the file it is being dropped on
 *
 * @param targetItemsIndex the index of the target item in the containing folder
 * @param draggedItemIsFolder whether the dragged item is a folder or not
 * @param removed the dragged item that has been removed from the virtual file system
 * @param updatedItems a copy of the virtual file system
 * @param foundTargetItemContainingFolder the containing folder of the target item
 * @returns an updated copy of the virtual file system
 */
function moveDraggedToFile({
    removed,
    updatedItems,
    targetItemsIndex,
    draggedItemIsFolder,
    foundTargetItemContainingFolder
}: IMoveDraggedToFileParams): VirtualFileSystem[] {
    // moving to a file
    if (draggedItemIsFolder) {
        // we need to place the removed item in the target item's parent folder at the correct index
        // if the target item's parent folder is null, then we are moving the dragged item to the root folder
        foundTargetItemContainingFolder === null ?
            // @ts-ignore
            updatedItems.splice(targetItemsIndex, 0, removed[0]) :
            // @ts-ignore
            foundTargetItemContainingFolder?.children.splice(targetItemsIndex, 0, removed[0]);
    } else {
        // find the target item's containing folder if it is null is is the root folder
        foundTargetItemContainingFolder === null && (() => {
            targetItemsIndex !== -1 && updatedItems.splice(targetItemsIndex, 0, removed[0]);
            targetItemsIndex === -1 && updatedItems.push(removed[0]);
        })();

        foundTargetItemContainingFolder !== null && (() => {
            // @ts-ignore
            targetItemsIndex !== -1 && foundTargetItemContainingFolder?.children.splice(targetItemsIndex, 0, removed[0]);
            // @ts-ignore
            targetItemsIndex === -1 && foundTargetItemContainingFolder?.children.push(removed[0]);
        })();
    }

    return updatedItems;
}


/**
 * Handles moving the dragged item to the target item by calling the appropriate function and updating the virtual file system
 *
 * @param targetItem the target item we are moving the dragged item to
 * @param draggedItem the dragged item we are moving
 * @param updatedItems a copy of the virtual file system
 * @param foundTargetItem the target item we are moving the dragged item to
 * @param targetItemsIndex the index of the target item in the containing folder
 * @param foundDraggedItem the dragged item we are moving
 * @param draggedItemsIndex the index of the dragged item in the containing folder
 * @param draggedItemIsFolder whether the dragged item is a folder or not
 * @param updateVirtualFileSystem a function to update the virtual file system
 * @param foundTargetItemContainingFolder the containing folder of the target item
 * @param foundDraggedItemContainingFolder the containing folder of the dragged item
 * 
 * @returns void
 */
function handleMovement({
    targetItem,
    draggedItem,
    updatedItems,
    foundTargetItem,
    targetItemsIndex,
    foundDraggedItem,
    draggedItemsIndex,
    draggedItemIsFolder,
    updateVirtualFileSystem,
    foundTargetItemContainingFolder,
    foundDraggedItemContainingFolder
}: IHandleMovementParams) {

    if (foundDraggedItem?.name !== foundTargetItem?.name) {

        if (isDescendant(draggedItem.found as unknown as IVirtualDirectory,
            foundTargetItem as unknown as IVirtualDirectory)) {
            return;
        }

        // remove the dragged item from the virtual file system
        const removed = foundDraggedItemContainingFolder !== null ?
            // @ts-ignore
            draggedItem.containingFolder?.children?.splice(draggedItemsIndex, 1) :
            updatedItems.splice(draggedItemsIndex, 1);

        // handle moving the item to a folder
        //@ts-ignore
        if (!foundTargetItem?.entryId) {
            // moving into a folder
            updatedItems = moveDraggedToFolder({
                draggedItemIsFolder,
                foundTargetItem,
                targetItem,
                updatedItems,
                removed
            });
        }

        // handle moving the item to a file
        // @ts-ignore
        if (foundTargetItem?.entryId) {

            updatedItems = moveDraggedToFile({
                targetItemsIndex,
                draggedItemIsFolder,
                removed,
                updatedItems,
                foundTargetItemContainingFolder
            });
        }
        // update the virtual file system
        updateVirtualFileSystem(updatedItems);
    }
}


/**
 * Handles dropping the dragged item on the target item by generating necessary data 
 * for the handleMovement function and calling it
 *
 * @param draggedItemId the id of the dragged item
 * @param targetItemId the id of the target item
 * @param virtualFileSystem a copy of the virtual file system
 * @param updateVirtualFileSystem a function to update the virtual file system
 *
 * @returns void
 */
export function dropController({ draggedItemId, targetItemId, virtualFileSystem, updateVirtualFileSystem }: IDropControllerParams) {
    // make a copy of the virtual file system so we can update the dragged item's position
    const updatedItems = [...virtualFileSystem];

    const isUUID = (id: string) => id?.length === 24 && /^[0-9a-fA-F]{24}$/.test(id);

    const targetIsUUID = isUUID(targetItemId);
    const draggedItemIsUUID = isUUID(draggedItemId);

    const targetItemIsFolder = !targetIsUUID;
    const draggedItemIsFolder = !draggedItemIsUUID;

    const targetItem = findItemInVfs(targetItemIsFolder, targetItemId, updatedItems);
    const draggedItem = findItemInVfs(draggedItemIsFolder, draggedItemId, updatedItems);

    const foundTargetItem = targetItem.found;
    const foundDraggedItem = draggedItem.found;
    const foundTargetItemContainingFolder = targetItem.containingFolder;
    const foundDraggedItemContainingFolder = draggedItem.containingFolder;


    // we need to move the found dragged item to the found target item folder
    const targetItemsIndex = getItemIndex(updatedItems, targetItemIsFolder, foundTargetItem, targetItem.containingFolder);
    const draggedItemsIndex = getItemIndex(updatedItems, draggedItemIsFolder, foundDraggedItem, draggedItem.containingFolder);

    handleMovement({
        targetItem,
        draggedItem,
        updatedItems,
        foundTargetItem,
        targetItemsIndex,
        foundDraggedItem,
        draggedItemsIndex,
        draggedItemIsFolder,
        updateVirtualFileSystem,
        foundTargetItemContainingFolder,
        foundDraggedItemContainingFolder
    });
}
