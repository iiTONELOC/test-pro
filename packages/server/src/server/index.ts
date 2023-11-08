import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

import routes from '../routes';
import { handleBodyParser } from './middleware';



export const startServer = async (callback?: Function) => {
    // Create Express server
    const server = express();
    const port = process.env.PORT ?? '3000';
    server.use(helmet());
    server.use(handleBodyParser);
    server.use(express.urlencoded({ extended: true }));
    server.use(express.json());
    server.use(cors());
    server.use(routes);

    server.get('/', (req, res) => {
        res.send('Hello World!');
    });

    // start server
    server.listen(parseInt(port, 10), () => {
        console.log(`Listening on port ${port}...`);
        if (callback) callback();
    });

    return server;
};
