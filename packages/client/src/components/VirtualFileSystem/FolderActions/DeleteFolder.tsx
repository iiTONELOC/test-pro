import { JSX } from 'preact/jsx-runtime';
import { useEffect } from 'preact/hooks';
import { useVirtualFileSystemSignal, useContextMenuSignal } from '../../../signals';
import { convertStateObjectToArray, findFolderInVfs, IVirtualDirectory } from '../../../utils';



export function DeleteFolder(): JSX.Element {
    const { virtualFileSystem, updateVirtualFileSystem } = useVirtualFileSystemSignal();
    const { id, showContextMenu } = useContextMenuSignal();

    const handleDelete = () => {
        const existingFileSystem = convertStateObjectToArray(virtualFileSystem.value);
        const folderNameToDelete = id.value;

        const existingFolder = findFolderInVfs(existingFileSystem, folderNameToDelete);
        const folder = existingFolder.found as IVirtualDirectory;
        const containingFolder: IVirtualDirectory | string = (existingFolder.containingFolder as IVirtualDirectory | null) || '__root__';

        const removeFromRoot = () => {
            // remove the folder from the containing folder
            const index = existingFileSystem.findIndex((child) => child.name === folderNameToDelete);
            existingFileSystem.splice(index, 1);
        }

        if (folder) {
            // need to get the folder's children and save them by moving them to the containing folder
            const children = folder.children;

            if (containingFolder !== '__root__' && typeof containingFolder !== 'string') {
                containingFolder.children.push(...children);
                // remove the folder from the containing folder
                const index = containingFolder.children.findIndex((child) => child.name === folderNameToDelete);
                containingFolder.children.splice(index, 1);
            } else {
                existingFileSystem.push(...children);
                // remove the folder from the containing folder
                removeFromRoot();
            }
        }

        updateVirtualFileSystem(existingFileSystem);
    };

    useEffect(() => {
        handleDelete();
        showContextMenu.value = false;
    }, []);

    return (<></>)
}
