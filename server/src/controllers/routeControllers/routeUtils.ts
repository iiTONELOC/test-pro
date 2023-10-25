import e, { Request, Response } from 'express';

export const httpStatusCodes = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500
};

/**
 * Determines whether timestamps should be shown in the response. This information is
 * extracted from the request query parameters. ie. `/api/topics?timestamps=true`
 * @param req
 * @returns true or false
 */
export const shouldShowTimestamps = (req: Request): boolean => {
    try {
        const { timestamps } = req.query;
        return timestamps === 'true';
    } catch (error) {
        console.error(error);
        return false;
    }
};

/**
 * Ensure that the error messages do not leak sensitive information to the client.
 * @param error
 * @returns the actual error message if applicable, or a generic error message
 */
export const handleRouteErrorMessages = (msg: string): string => {
    if (msg.includes('duplicate key error')) {
        return 'Already exists';
    }

    if (msg.includes('Error: request size did not match content length')) {
        return 'Invalid request body';
    }

    return msg ?? 'Something went wrong';
}

/**
 * Sanitizes the error message and returns the appropriate HTTP status code.
 * @param errorMsg : The error message to be sanitized
 * @returns the appropriate HTTP status code
 */
export const handleRouteErrorCodes = (errorMsg: string): number => {
    if (errorMsg.includes('Already exists') || errorMsg.includes('already been answered')) {
        return httpStatusCodes.CONFLICT;
    } else if (
        errorMsg.includes('Invalid request body') //NOSONAR
        || errorMsg.includes('Cast to ObjectId failed')
        || errorMsg.includes('required')
        || errorMsg.includes('validation failed')
        || errorMsg.includes('Nothing to update')
    ) {
        return httpStatusCodes.BAD_REQUEST;
    } else if (errorMsg.includes('not found')) {
        return httpStatusCodes.NOT_FOUND;
    } else {
        return httpStatusCodes.INTERNAL_SERVER_ERROR;
    }
}

/**
 * Sanitizes the error message and returns the appropriate HTTP Response.
 * @param res : Express Response object
 * @param errorMsg : The error message to be sanitized
 * @returns an Express Response object with the appropriate HTTP status code and error message
 */
export const handleRouteError = (res: Response, errorMsg: string): Response => {
    const message = handleRouteErrorMessages(errorMsg);
    const statusCode = handleRouteErrorCodes(message);
    return res.status(statusCode).json({ error: message });
}
