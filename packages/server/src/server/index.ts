import fs from 'fs';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import express from 'express';
import routes from '../routes';
import { loadEnv } from '../loadEnv';
import { handleBodyParser } from './middleware';

loadEnv();



export const startServer = async (callback?: Function, port = '3000') => {
    // Create Express server
    const app = express();

    // create the https server and bootstrap the express app


    app.use(helmet());
    app.use(handleBodyParser);
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(cors());

    // if we are in production, serve our React app's index.html file
    if (process.env.NODE_ENV === 'production') {
        const clientFolder = path.resolve(__dirname, '../../../client/dist');

        app.use(express.static(clientFolder));
        app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, clientFolder, 'index.html'));
        });
    }

    // turn on the api routes
    app.use(routes);

    // start listening for incoming https requests
    app.listen(parseInt(port, 10), () => {
        console.log(`Listening on port ${port}...`);
        if (callback) callback();
    });

    return app;
};
