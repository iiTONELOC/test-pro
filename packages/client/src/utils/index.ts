export function trimClasses(text: string) {
    if (!text) return ''

    return text.replace(/\s+/g, ' ').trim()
}

export const uuid = () => Math.random().toString(36).substring(2) + Date.now().toString(36);

// Export the API

export type { IApiResponse, QuizModelResponse, QuestionModelResponse, dbQueryParams, PopulatedQuizModel, TopicModelType } from './api';
export { default as API, defaultAPIQueryParams } from './api';

// Export Virtual File System
export type { IVirtualDirectory, IVirtualFile, VirtualFileSystem } from './virtualFileSystem';
export { getVirtualFileSystem, generateFileSystem } from './virtualFileSystem';


// Export Event Controllers
export type { ClickHandlerProps, KeyHandlerProps } from './eventControllers';
export { clickHandler, keyHandler } from './eventControllers';
