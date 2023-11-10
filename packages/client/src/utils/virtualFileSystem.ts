
import type { PopulatedQuizModel, QuizModelResponse, TopicModelType } from './api';

export interface IVirtualDirectory {
    name: string;
    children: VirtualFileSystem[];
    topics?: string[];
}

export interface IVirtualFile {
    name: string;
    entryId: string;
    topics: string[];
}

export type VirtualFileSystem = (IVirtualDirectory | IVirtualFile);


// create or retrieve virtual file system
export const getVirtualFileSystem: () => VirtualFileSystem[] = (): VirtualFileSystem[] => JSON
    .parse(localStorage.getItem('virtualFileSystem') || '[]') ?? [];

const createVirtualDirectory = (name: string, children: IVirtualDirectory[] = []): IVirtualDirectory => ({ name, children });

const createVirtualFile = (name: string, entryId: string, topics: string[]): IVirtualFile => ({ name, entryId, topics });

// takes in quiz data, and existing virtual file system and returns a new virtual file system
export const generateFileSystem = (quizData: PopulatedQuizModel[], existingFileSystem: VirtualFileSystem[]):
    VirtualFileSystem[] => {

    // get the quiz ids from the quizData
    const quizIds: string[] = quizData.map((quiz: QuizModelResponse): string => quiz?._id.toString());

    // recursive function to check the virtual file system for the quiz ids
    function checkFolder(existingFolder: VirtualFileSystem[]): void {
        for (const child of existingFolder) {
            // if virtual file
            if (child && 'entryId' in child) {
                // if the quizIds array contains the child entryId then remove 
                // it from the quizIds array
                if (quizIds.includes(child.entryId)) {
                    quizIds.splice(quizIds.indexOf(child.entryId), 1);
                }
                // virtual directory - recurse through the children
            } else if (child && 'children' in child) {
                checkFolder(child.children);
            }
        }
    }

    // create a file for the given quiz ids and add them to the existingFileSystem
    function createVirtualQuizFileAndAddToFileSystem(quizIds: string[]): void {
        for (const id of quizIds) {
            // get the quiz from the quizData
            const quiz = quizData
                .find((quiz: QuizModelResponse): boolean => quiz?._id.toString() === id);

            // if the quiz exists then create a file for it
            if (quiz as PopulatedQuizModel) {
                const quizTopics = quiz?.topics as TopicModelType[];
                const topics: string[] = quizTopics.map(topic => topic?.name) ?? [];

                const quizFile: IVirtualFile = createVirtualFile(quiz?.name as string,
                    quiz?._id.toString() as string,
                    topics);
                // add the quizFile to the existingFileSystem
                existingFileSystem.push(quizFile);
            }
        }
    }

    // check the virtual file System for the quiz ids  this will
    // remove any quiz ids that are already in the virtual file system
    // from the quizIds array
    checkFolder(existingFileSystem);

    // if there are any missing quiz ids then create a file for them
    if (quizIds.length > 0) {
        createVirtualQuizFileAndAddToFileSystem(quizIds);
    }

    return existingFileSystem;
};
