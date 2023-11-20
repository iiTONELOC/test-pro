import type { PopulatedQuizModel, QuizModelResponse, TopicModelType } from './api';

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
    children: VirtualFileSystem[];
    topics?: string[];
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
const createVirtualDirectory = (name: string, children: VirtualFileSystem[] = []): IVirtualDirectory => ({ name, children });

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
 * Creates a virtual file for each quiz id and adds it to the existingFileSystem
 * @param quizIds an array of quiz ids to create virtual files for
 * @param existingFileSystem an existing virtual file system to add the virtual files to
 * @param quizData an array of populated quiz data from the db to get the quiz names and topics from
 * @returns the updated virtual file system
 */
const createVirtualQuizFileAndAddToFileSystem = (quizIds: string[], existingFileSystem: VirtualFileSystem[], quizData: PopulatedQuizModel[]): VirtualFileSystem[] => {
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
            existingFileSystem.push(quizFile);
        }
    }

    return existingFileSystem;
}


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
    const remainingQuizIds = checkFolder(existingFileSystem, quizIds);

    // for any quiz ids that are left over, we need to create a file for them and update the virtual file system
    if (remainingQuizIds.length > 0) {
        existingFileSystem = createVirtualQuizFileAndAddToFileSystem(remainingQuizIds, existingFileSystem, quizData);
    }

    // check the existingFileSystem for any ids that are not in the quizData, these need to be removed
    const temp = existingFileSystem.filter((child: VirtualFileSystem): boolean => {
        if ('entryId' in child) {
            return quizData.some((quiz: QuizModelResponse): boolean => quiz?._id.toString() === child.entryId);
        }
        return true;
    });


    // enforce the order of the virtual file system when merging
    // we need to check for files and folders folders do not have entryIds they have a name property and children property
    for (let i = 0; i < existingFileSystem.length; i++) {
        // if the child is a virtual file
        if ('entryId' in existingFileSystem[i]) {
            // find the index of the child in the temp array
            //@ts-ignore
            const index = temp.findIndex((child: VirtualFileSystem): boolean => child.entryId === existingFileSystem[i].entryId);
            // if the index is not -1 then the child exists in the temp array
            if (index !== -1) {
                // remove the child from the temp array
                temp.splice(index, 1);
                // add the child to the temp array at the same index as it was in the existingFileSystem
                temp.splice(i, 0, existingFileSystem[i]);
            }
        } else {
            // the child is a virtual directory
            // find the index of the child in the temp array
            //@ts-ignore
            const index = temp.findIndex((child: VirtualFileSystem): boolean => child.name === existingFileSystem[i].name);
            // if the index is not -1 then the child exists in the temp array
            if (index !== -1) {
                // remove the child from the temp array
                temp.splice(index, 1);
                // add the child to the temp array at the same index as it was in the existingFileSystem
                temp.splice(i, 0, existingFileSystem[i]);
            }
        }
    }

    return temp;
};


/**
 * Looks for the virtual file system in local storage and returns it, If it doesn't exist it returns an empty array
 * @returns an array of virtual file system objects
 */
export const getVirtualFileSystemFromStorage: () => VirtualFileSystem[] = (): VirtualFileSystem[] => JSON
    .parse(localStorage.getItem('virtualFileSystem') ?? '[]') ?? [];


export const setVirtualFileSystemToStorage = (virtualFileSystem: VirtualFileSystem[]): void => {
    localStorage.setItem('virtualFileSystem', JSON.stringify(virtualFileSystem));
};
