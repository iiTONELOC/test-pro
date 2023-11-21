import { dropController, IDropControllerParams } from '../../utils';


export function handleOnDrop({ draggedItemId, targetItemId, virtualFileSystem, updateVirtualFileSystem }: IDropControllerParams) {
    return dropController({ draggedItemId, targetItemId, virtualFileSystem, updateVirtualFileSystem });
};
