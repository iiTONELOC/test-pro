export function trimClasses(text: string) {
    if (!text) return ''

    return text.replace(/\s+/g, ' ').trim()
}

export const uuid = () => Math.random().toString(36).substring(2) + Date.now().toString(36);

export const titleCase = (str = '') => str.split(' ').map(word => word[0].toUpperCase() + word.slice(1)).join(' ');

export const getTime = (date: Date) => {
    !date && (date = new Date());
    date = new Date(date)
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

    const AorP = hours < 12 ? 'a' : 'p';

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds} ${AorP}m`;
}

export const getFormattedDate = (date: Date) => {
    !date && (date = new Date());
    date = new Date(date)

    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();

    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedDay = day < 10 ? `0${day}` : day;

    return `${formattedMonth}/${formattedDay}/${year}`;
};


export const dateTime = (date: Date) => `${getFormattedDate(date)} - ${getTime(date)}`;

// Export the API

export type { IApiResponse, QuizModelResponse, QuestionModelResponse, dbQueryParams, PopulatedQuizModel, TopicModelType } from './api';
export { default as API, defaultAPIQueryParams } from './api';

// Export Virtual File System
export type { IVirtualDirectory, IVirtualFile, VirtualFileSystem } from './virtualFileSystem';
export { getVirtualFileSystem, generateFileSystem } from './virtualFileSystem';


// Export Event Controllers
export type { ClickHandlerProps, KeyHandlerProps } from './eventControllers';
export { clickHandler, keyHandler } from './eventControllers';
