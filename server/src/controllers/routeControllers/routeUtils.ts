import { Request } from 'express';

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
export const handleRouteErrorMessages = (error: any): string => {
    if (error.message.includes('duplicate key error')) {
        return 'Already exists';
    }

    if (error.message.includes('Error: request size did not match content length')) {
        return 'Invalid request body';
    }

    return error.message as string ?? 'Something went wrong';
}

export const handleRouteErrorCodes = (errorMsg: string): number => {
    if (errorMsg.includes('Already exists')) {
        return 409;
    }

    if (
        errorMsg.includes('Invalid request body')
        || errorMsg.includes('Cast to ObjectId failed')
        || errorMsg.includes('required')) {
        return 400;
    }

    if (errorMsg.includes('Something went wrong')) {
        return 500;
    }

    console.error(errorMsg);

    return 500;
}

