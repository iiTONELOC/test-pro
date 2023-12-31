import { API, type PopulatedQuizModel, type QuizModelResponse, type TopicModelType } from './api';

export type VirtualFileSystemState = { [key: string]: VirtualFileSystem };
/**
 * ```ts
 * export interface IVirtualDirectory {
 *   name: string;
 *   children: VirtualFileSystem[];
 *   topics?: string[];
 * }
 * ```
 */
export interface IVirtualDirectory {
    name: string;
    children: (IVirtualDirectory | IVirtualFile)[];
    topics?: string[];
    isOpen: boolean;
}

/**
 * ```ts
 * export interface IVirtualFile {
 *   name: string;
 *   entryId: string;
 *   topics: string[];
 * }
 * ```
 */
export interface IVirtualFile {
    name: string;
    entryId: string;
    topics: string[];
    createdAt: Date;
    updatedAt: Date;
}

export type VirtualFileSystem = (IVirtualDirectory | IVirtualFile);


/**
 * Creates a virtual directory with the given name and children
 * @param name the name of the virtual directory
 * @param children an array of virtual file system objects to add to the virtual directory
 * @returns The created virtual directory object
 */
export const createVirtualDirectory = (name: string, children: VirtualFileSystem[] = []): IVirtualDirectory => ({ name, children, isOpen: false });

/**
 * Creates a virtual file with the given name, entryId and topics
 * @param name name of the virtual file
 * @param entryId the id of the quiz that the virtual file represents
 * @param topics an array of topic names that the quiz is associated with
 * @returns The created virtual file object
 */
const createVirtualFile = (name: string, entryId: string, topics: string[], createdAt: Date, updatedAt: Date): IVirtualFile => (
    { name, entryId, topics, createdAt, updatedAt });

/**
 *  Checks the virtual file system for the quiz ids
 * @param existingFolder a virtual file system to check
 * @param quizIds an array of quiz ids to check for
 * @returns an array of quiz ids that were not found in the virtual file system
 */
const checkFolder = (existingFolder: VirtualFileSystem[], quizIds: string[]): string[] => {
    if (!existingFolder) return [];

    for (const child of existingFolder) {
        // if virtual file
        if (child && 'entryId' in child && quizIds.includes(child.entryId)) {
            // if the quizIds array contains the child entryId then remove it from the quizIds array
            quizIds.splice(quizIds.indexOf(child.entryId), 1);
        }

        // virtual directory found - recurse through the children
        if (child && 'children' in child) {
            quizIds = checkFolder(child.children, quizIds);
        }
    }
    return quizIds;
}

/**
 * Creates a virtual file for each quiz id and adds it to the existingFileSystem's root or to an existing folder
 * @param quizIds an array of quiz ids to create virtual files for
 * @param existingFileSystem an existing virtual file system to add the virtual files to
 * @param quizData an array of populated quiz data from the db to get the quiz names and topics from
 * 
 * @returns the updated virtual file system
 */
export const createVirtualQuizFileAndAddToFileSystem = (
    quizIds: string[], existingFileSystem: VirtualFileSystem[], quizData: PopulatedQuizModel[], addToFolderName: string = '__root__'
): VirtualFileSystem[] => {
    for (const id of quizIds) {
        // get the quiz from the quizData
        const quiz = quizData.find((quiz: QuizModelResponse): boolean => quiz?._id.toString() === id);

        // if the quiz exists then create a file for it
        if (quiz) {
            const quizTopics = quiz?.topics as TopicModelType[];
            const topics: string[] = quizTopics.map(topic => topic?.name) ?? [];

            const quizFile: IVirtualFile = createVirtualFile(
                quiz?.name as string,
                quiz?._id.toString() as string,
                topics,
                quiz?.createdAt as Date,
                quiz?.updatedAt as Date
            );


            // if we are adding to a folder then we need to add the quizFile to the folder
            if (addToFolderName !== '__root__') {
                // @ts-ignore
                findFolderInVfs(existingFileSystem, addToFolderName).found?.children.push(quizFile);
            } else {
                existingFileSystem.push(quizFile);
            }
        }
    }

    return existingFileSystem;
}

/**
 * Creates a virtual folder for all the quizzes and adds it to the existingFileSystem's root or to an existing folder
 * @param quizIds an array of quiz ids to create virtual files for
 * @param existingFileSystem an existing virtual file system to add the virtual files to
 * @param quizData an array of populated quiz data from the db to get the quiz names and topics from
 * @param folderName the name of the folder to create
 * @param addToFolderName the name of the folder to add the new folder to
 * @returns the updated virtual file system
 */
export const createFolderForQuizzesAndAddToFileSystem = (
    quizIds: string[], existingFileSystem: VirtualFileSystem[],
    quizData: PopulatedQuizModel[], folderName: string, addToFolderName: string = '__root__'): VirtualFileSystem[] => {

    const folder: IVirtualDirectory = createVirtualDirectory(folderName);

    // create a virtual file for each quiz id and add it to the folder
    for (const id of quizIds) {
        // get the quiz from the quizData
        const quiz = quizData.find((quiz: QuizModelResponse): boolean => quiz?._id.toString() === id);

        // if the quiz exists then create a file for it
        if (quiz) {
            const quizTopics = quiz?.topics as TopicModelType[];
            const topics: string[] = quizTopics.map(topic => topic?.name) ?? [];

            const quizFile: IVirtualFile = createVirtualFile(
                quiz?.name as string,
                quiz?._id.toString() as string,
                topics,
                quiz?.createdAt as Date,
                quiz?.updatedAt as Date
            );
            // add the quizFile to the existingFileSystem
            folder.children.push(quizFile);
        }
    }

    // add the folder to the existing FileSystem
    if (addToFolderName === '__root__') {
        existingFileSystem.push(folder)
    } else {
        // @ts-ignore
        findFolderInVfs(existingFileSystem, addToFolderName).found?.children.push(folder);
    }

    return existingFileSystem;
}

/**
 * Looks for the entryId in the given virtual file system and returns it if found
 * @param item a virtual file system object
 * @returns the entryId if it exists, otherwise the name of the object
 */
export const getItemIdOrFolderName = (item: IVirtualDirectory | IVirtualFile): string => {
    if (!item) throw new Error('item is undefined');
    if ((item as IVirtualFile).entryId) {
        return (item as IVirtualFile).entryId;
    } else {
        return (item as IVirtualDirectory).name;
    }
};


/**
 * Generates a virtual file system from the given quiz data and merges it with the existing virtual file system if it exists
 * @param quizData the quiz data to generate the virtual file system from
 * @param existingFileSystem an existing virtual file system to merge with the generated virtual file system
 * @returns the updated virtual file system
 */
export const generateFileSystem = (quizData: PopulatedQuizModel[], existingFileSystem: VirtualFileSystem[]): VirtualFileSystem[] => {

    // get the quiz ids from the quizData
    const quizIds: string[] = quizData.map((quiz: QuizModelResponse): string => quiz?._id.toString());

    // update the quizIds array to remove any quizzes that are already in the virtual file system
    const remainingQuizIds: string[] = checkFolder(existingFileSystem, quizIds);

    // for any quiz ids that are left over, we need to create a file for them and update the virtual file system
    if (remainingQuizIds.length > 0) {
        existingFileSystem = createVirtualQuizFileAndAddToFileSystem(remainingQuizIds, existingFileSystem, quizData);
    }

    // check the existingFileSystem for any ids that are not in the quizData, these need to be removed
    const temp: VirtualFileSystem[] = existingFileSystem.filter((child: VirtualFileSystem): boolean => {
        if (!child) return false;
        if ('entryId' in child) {
            return quizData.some((quiz: QuizModelResponse): boolean => quiz?._id.toString() === child.entryId);
        }
        return true;
    });

    const updateIndex = (index: number, i: number): void => {
        // remove the child from the temp array
        temp.splice(index, 1);
        // add the child to the temp array at the same index as it was in the existingFileSystem
        temp.splice(i, 0, existingFileSystem[i]);
    }

    // // enforce the order of the virtual file system when merging
    // // we need to check for files and folders folders do not have entryIds they have a name property and children property
    for (let i = 0; i < existingFileSystem.length; i++) {
        const index: number = temp.findIndex((child: VirtualFileSystem): boolean => {
            try {
                return getItemIdOrFolderName(child) === getItemIdOrFolderName(existingFileSystem[i])
            } catch (error) {
                console.log(error);
                return false;
            }
        });


        if (index !== -1) {
            updateIndex(index, i);
        }
        // should happen when an item was deleted from the db but still exists in the virtual file system
        // the item in question should have been filtered when the temp array was created so do nothing
    }

    return temp;
};



/**
 * Retrieves the virtual file system from local storage
 * @returns an array of virtual file system objects
 */
export const getVirtualFileSystem = async (): Promise<VirtualFileSystem[]> => {
    const vfs = await API.getVfs();

    if (!vfs) return [];

    const { virtualFileSystem } = vfs as unknown as { virtualFileSystem: VirtualFileSystem[] };

    if (!virtualFileSystem) return [];

    return virtualFileSystem;
}


export function findFolderInVfs(
    virtualFileSystem: VirtualFileSystem[],
    folderName: string,
): { found: VirtualFileSystem | null; containingFolder: VirtualFileSystem | null } {
    let found: VirtualFileSystem | null = null;
    let containingFolder: VirtualFileSystem | null = null;


    // for each folder in the virtual file system, look for our folder with the folderName, it could be at root or in another folder
    for (const folder of virtualFileSystem) {
        if (folder.name === folderName) {
            found = folder;
            containingFolder = null;
            break;
        }
        // @ts-ignore
        const didFind = folder?.children?.find(item => item?.name === folderName);
        if (didFind) {
            found = didFind;
            containingFolder = folder;
            break;
        } else {
            // we need to look in the children of this folder for any folders and recurse down
            // @ts-ignore
            const folders = folder?.children?.filter(item => item?.children);
            if (folders) {
                const { found: foundInFolder, containingFolder: containingFolderInFolder } = findFolderInVfs(folders, folderName);
                if (foundInFolder) {
                    found = foundInFolder;
                    containingFolder = containingFolderInFolder;
                    break;
                }
            }
        }
    }

    return { found, containingFolder };
}

export function findFileInVfs(virtualFileSystem: VirtualFileSystem[], entryId: string): { found: IVirtualFile | null; containingFolder: IVirtualDirectory | null } {
    let found: IVirtualFile | null = null;
    let containingFolder: IVirtualDirectory | null = null;

    // see if the entryId is in the root
    // @ts-ignore
    const didFind = virtualFileSystem?.find(item => item?.entryId === entryId);
    if (didFind) {
        found = didFind as IVirtualFile;
        containingFolder = null;
    }

    // for each folder in the virtual file system, look for our file with the entryId
    for (const folder of virtualFileSystem) {
        // @ts-ignore
        const didFind = folder?.children?.find(item => item?.entryId === entryId);
        if (didFind) {
            found = didFind;
            containingFolder = folder as IVirtualDirectory;
            break;
        } else {
            // we need to look in the children of this folder for any folders and recurse down
            // @ts-ignore
            const folders = folder?.children?.filter(item => item?.children);
            if (folders) {
                const { found: foundInFolder, containingFolder: containingFolderInFolder } = findFileInVfs(folders, entryId);
                if (foundInFolder) {
                    found = foundInFolder;
                    containingFolder = containingFolderInFolder;
                    break;
                }
            }
        }
    }

    return { found, containingFolder };
}

export const createVfsObject = (objectToInsert: VirtualFileSystemState) => ({ "virtualFileSystem": convertStateObjectToArray(objectToInsert) });


export const convertArrayToStateObject = (array: VirtualFileSystem[]): VirtualFileSystemState => {
    const temp: VirtualFileSystemState = {};
    array.forEach(entry => {
        // @ts-ignore
        temp[entry?.entryId ?? entry.name] = entry;
    });
    return temp;
};

export const convertStateObjectToArray = (stateObject: VirtualFileSystemState): VirtualFileSystem[] => {
    const temp: VirtualFileSystem[] = [];
    Object.keys(stateObject).forEach(key => {
        temp.push(stateObject[key]);
    });
    return temp;
}

