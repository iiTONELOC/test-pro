import { VirtualFileSystem, findFileInVfs, findFolderInVfs } from '../virtualFileSystem';

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

const getTargetItemsIndex = (
    updatedItems: VirtualFileSystem[],
    targetItemIsFolder: boolean,
    foundTargetItem: VirtualFileSystem | null,
    foundTargetItemContainingFolder: VirtualFileSystem | null
): number => {
    return foundTargetItemContainingFolder === null ? updatedItems
        // @ts-ignore
        .findIndex(item => targetItemIsFolder ? item.name === foundTargetItem?.name : item?.entryId === foundTargetItem?.entryId) :
        // @ts-ignore
        foundTargetItemContainingFolder?.children.findIndex(item => targetItemIsFolder ? item.name === foundTargetItem?.name : item?.entryId === foundTargetItem?.entryId);
};

const getDraggedItemsIndex = (
    updatedItems: VirtualFileSystem[],
    draggedItemIsFolder: boolean,
    foundDraggedItem: VirtualFileSystem | null,
    foundDraggedItemContainingFolder: VirtualFileSystem | null
): number => {
    return foundDraggedItemContainingFolder === null ? updatedItems
        // @ts-ignore
        .findIndex(item => draggedItemIsFolder ? item.name === foundDraggedItem?.name : item?.entryId === foundDraggedItem?.entryId) :
        // @ts-ignore
        foundDraggedItemContainingFolder?.children.findIndex(item => draggedItemIsFolder ? item.name === foundDraggedItem?.name : item?.entryId === foundDraggedItem?.entryId);
};

const getDraggedItem = (
    draggedIsFolder: boolean, draggedItemId: string, virtualFileSystem: VirtualFileSystem[]): {
        found: VirtualFileSystem | null;
        containingFolder: VirtualFileSystem | null;
    } => {
    return draggedIsFolder ?
        findFolderInVfs([...virtualFileSystem], draggedItemId) :
        findFileInVfs([...virtualFileSystem], draggedItemId);
}

const getTargetItem = (targetIsFolder: boolean, targetItemId: string, virtualFileSystem: VirtualFileSystem[]): {
    found: VirtualFileSystem | null;
    containingFolder: VirtualFileSystem | null;
} => {
    return targetIsFolder ?
        findFolderInVfs([...virtualFileSystem], targetItemId) :
        findFileInVfs([...virtualFileSystem], targetItemId);
}

interface IMoveDraggedToFolderParams {
    draggedItemIsFolder: boolean;
    removed: VirtualFileSystem[];
    updatedItems: VirtualFileSystem[];
    foundTargetItem: VirtualFileSystem | null;
    targetItem: {
        found: VirtualFileSystem | null;
        containingFolder: VirtualFileSystem | null;
    },

}

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

    return updatedItems;
}

interface IMoveDraggedToFileParams {
    targetItemsIndex: number;
    draggedItemIsFolder: boolean;
    removed: VirtualFileSystem[];
    updatedItems: VirtualFileSystem[];
    foundTargetItemContainingFolder: VirtualFileSystem | null;
}


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

interface IHandleMovementParams {
    draggedItemsIndex: number;
    targetItemsIndex: number;
    draggedItemIsFolder: boolean;
    updatedItems: VirtualFileSystem[];
    foundDraggedItem: VirtualFileSystem | null;
    foundTargetItem: VirtualFileSystem | null;
    foundDraggedItemContainingFolder: VirtualFileSystem | null;
    foundTargetItemContainingFolder: VirtualFileSystem | null;
    targetItem: {
        found: VirtualFileSystem | null;
        containingFolder: VirtualFileSystem | null;
    },
    draggedItem: {
        found: VirtualFileSystem | null;
        containingFolder: VirtualFileSystem | null;
    },
    updateVirtualFileSystem: (virtualFileSystem: VirtualFileSystem[]) => void;
}

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



export function dropController({ draggedItemId, targetItemId, virtualFileSystem, updateVirtualFileSystem }: IDropControllerParams) {
    // make a copy of the virtual file system so we can update the dragged item's position
    const updatedItems = [...virtualFileSystem];

    const isUUID = (id: string) => id?.length === 24 && /^[0-9a-fA-F]{24}$/.test(id);

    const targetIsUUID = isUUID(targetItemId);
    const draggedItemIsUUID = isUUID(draggedItemId);

    const targetItemIsFolder = !targetIsUUID;
    const draggedItemIsFolder = !draggedItemIsUUID;

    const targetItem = getTargetItem(targetItemIsFolder, targetItemId, updatedItems);
    const draggedItem = getDraggedItem(draggedItemIsFolder, draggedItemId, updatedItems);

    const foundTargetItem = targetItem.found
    const foundDraggedItem = draggedItem.found
    const foundTargetItemContainingFolder = targetItem.containingFolder;
    const foundDraggedItemContainingFolder = draggedItem.containingFolder;


    // we need to move the found dragged item to the found target item folder
    const targetItemsIndex = getTargetItemsIndex(updatedItems, targetItemIsFolder, foundTargetItem, targetItem.containingFolder);
    const draggedItemsIndex = getDraggedItemsIndex(updatedItems, draggedItemIsFolder, foundDraggedItem, draggedItem.containingFolder);

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

