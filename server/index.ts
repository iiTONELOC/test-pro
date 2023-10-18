import { startServer } from './src/server';
import { dbConnection, dbClose } from './src/db/connection';


await dbConnection().then(async () => {
    console.log('Connected to database');
    console.log('Starting server');
    await startServer();
}).catch((error: any) => {
    dbClose();
});

