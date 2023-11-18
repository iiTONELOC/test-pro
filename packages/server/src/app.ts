import { startServer } from './server';
import { dbConnection, dbClose } from './db/connection';


(async () => {
    await dbConnection().then(async () => {
        console.log('Connected to database');
        console.log('Starting server');
        await startServer();
    }).catch((error: any) => {
        dbClose();
    });
})();
