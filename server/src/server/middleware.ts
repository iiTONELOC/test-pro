import express, { Request, Response, NextFunction } from 'express';

export const handleBodyParser = (req: Request, res: Response, next: NextFunction) => {
    // express is leaking the error to the client exposing internal details
    express.json()(req, res, (err) => {
        if (err) {
            if (err.message.includes('length')) {
                return res.status(400).json({ error: 'Malformed request!' });
            } else {
                return res.status(500).json({ error: 'There was an error parsing your request!' })
            }
        }
        next();
    });
};
