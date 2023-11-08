import mongoose from 'mongoose';

const dbConnection = async (dbName?: string | null): Promise<typeof mongoose> => {
    try {
        const URI = (process.env.DB_URI ?? 'mongodb://localhost:27017/') + (dbName ?? process.env.DB_NAME);
        const db = await mongoose.connect(URI);
        return db;
    } catch (error: any) {
        console.log(`Error: ${error['message']}`);
        return Promise.reject(error);
    }
};

const dbClose = async (): Promise<void> => {
    try {
        await mongoose.connection.close();
    } catch (error: any) {
        console.log(`Error: ${error['message']}`);
    }
};

export default dbConnection;

export { dbConnection, dbClose }
