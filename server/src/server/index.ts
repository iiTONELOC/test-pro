import express, { Router } from 'express';
import cors from 'cors';

const port = process.env.PORT ?? '3000';


const routes = () => {
    const router = Router();
    const mainRoute = router.use('/', (req, res) => {
        res.send('Hello World!');
    });

    return mainRoute;
}

export const startServer = async (callback?: Function) => {
    // Create Express server
    const server = express();

    // attach middleware
    server.use(express.json());
    server.use(express.urlencoded({ extended: true }));
    server.use(cors());

    // disable insecure headers
    server.disable('x-powered-by');
    server.disable('etag');

    // attach routes
    server.use(routes());

    // start server
    server.listen(parseInt(port, 10), () => {
        console.log(`Listening on port ${port}...`);
        if (callback) callback();
    });
};
