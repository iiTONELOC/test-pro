import { Response } from 'express';
export * from './dbControllers/types';
export * from './routeControllers/types';

export interface IApiResponse<T> extends Response {
    data?: T;
    error?: string;
};

/**
 *  Optional query parameters for database queries.
 *
 * `showTimestamps`: Determines whether timestamps should be shown in the response. This defaults to false.
 * `needToPopulate`: Determines whether the response should be populated. This defaults to true.
 * ```ts
 *  type dbQueryParams = {
 *     showTimestamps: boolean;
 *     needToPopulate: boolean;
 * };
 * ```
 */
export type dbQueryParams = {
    showTimestamps: boolean;
    needToPopulate: boolean;
};
