import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import express from 'express';
import routes from '../routes';
import { loadEnv } from '../loadEnv';
import { handleBodyParser } from './middleware';



loadEnv();

export const startServer = async (callback?: Function) => {
    // Create Express server
    const server = express();

    const port = process.env.PORT ?? '3000';
    server.use(helmet());
    server.use(handleBodyParser);
    server.use(express.urlencoded({ extended: true }));
    server.use(express.json());
    server.use(cors());



    // if we are in production, serve our React app's index.html file
    if (process.env.NODE_ENV === 'production') {
        const clientFolder = path.resolve(__dirname, '../../../client/dist');

        server.use(express.static(clientFolder));
        server.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, clientFolder, 'index.html'));
        });
    }

    server.use(routes);



    // start server
    server.listen(parseInt(port, 10), () => {
        console.log(`Listening on port ${port}...`);
        if (callback) callback();
    });

    return server;
};
