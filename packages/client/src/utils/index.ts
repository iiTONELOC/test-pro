export const uuid = () => Math.random().toString(36).substring(2) + Date.now().toString(36);
export const trimClasses = (text: string): string => !text ? '' : text.replace(/\s+/g, ' ').trim();
export const titleCase = (str = '') => str.split(' ').map(word => word[0].toUpperCase() + word.slice(1)).join(' ');

export const calculatePassingScore = (questions: any[]): number => !questions ? 0 : Math.ceil(questions.length * 0.7);

// Export the utility modules

// Export the API
export type {
    IApiResponse, QuizModelResponse, QuestionModelResponse, dbQueryParams,
    PopulatedQuizModel, TopicModelType, PopulatedQuestionModelType
} from './api';
export { default as API, defaultAPIQueryParams } from './api';

// Export Virtual File System
export type { IVirtualDirectory, IVirtualFile, VirtualFileSystem } from './virtualFileSystem';
export {
    getVirtualFileSystemFromStorage, generateFileSystem, setVirtualFileSystemToStorage,
    getItemIdOrFolderName, createVirtualDirectory
} from './virtualFileSystem';

// Export Event Controllers
export type { ClickHandlerProps, KeyHandlerProps } from './eventControllers';
export { clickHandler, keyHandler } from './eventControllers';

// Export Quiz Runner
export type { IAnsweredQuestionData, IQuizAttemptData } from './quizRunner';
export { quizRunnerState } from './quizRunner';

// Export Date and Time
export * from './dateAndTime';

// Export Array Shuffling
export { shuffle } from './shuffle';

// Export Math helpers
export * from './math';

// Export Drag and Drop helpers
export * from './drop';
