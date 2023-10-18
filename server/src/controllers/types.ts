import { Response } from 'express';
export * from './dbControllers/types';
export * from './routeControllers/types';
export interface IApiResponse<T> extends Response {
    data?: T;
    error?: string;
};

