import { Request, Response } from 'express';
import { readVfs, writeVfs, deleteVfs } from '../../utils';

import type { IApiResponse } from '../types';
import { handleRouteError, httpStatusCodes } from './routeUtils';

export interface IVfsRouteController {
    get: (req: Request, res: Response) => Promise<IApiResponse<JSON>>;
    update: (req: Request, res: Response) => Promise<IApiResponse<JSON>>;
    delete: (req: Request, res: Response) => Promise<IApiResponse<JSON>>;
}

export const vfsRouteController: IVfsRouteController = {
    get: async (req, res) => {
        try {
            const vfs = readVfs();
            return res.status(httpStatusCodes.OK).json({ data: vfs });
        } catch (error: any) {
            return handleRouteError(res, error.message);
        }
    },
    update: async (req, res) => {
        try {
            const vfs = req.body;
            writeVfs(vfs);
            return res.status(httpStatusCodes.OK).json({ data: vfs });
        } catch (error: any) {
            return handleRouteError(res, error.message);
        }
    },
    delete: async (req, res) => {
        try {
            deleteVfs();
            return res.status(httpStatusCodes.OK).json({ data: {} });
        } catch (error: any) {
            return handleRouteError(res, error.message);
        }
    }
};

export default vfsRouteController;
