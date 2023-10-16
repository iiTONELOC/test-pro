import mongoose from 'mongoose';

const dbConnection = async (): Promise<typeof mongoose> => {
    try {
        const URI = (process.env.DB_URI ?? 'mongodb://localhost:27017/') + process.env.DB_NAME;
        const db = await mongoose.connect(URI);
        console.log(`MongoDB connected to ${URI}`);
        return db;
    } catch (error: any) {
        console.log(`Error: ${error['message']}`);
        return Promise.reject(error);
    }
};

const dbClose = async (): Promise<void> => {
    try {
        await mongoose.connection.close();
        console.log('MongoDB disconnected');
    } catch (error: any) {
        console.log(`Error: ${error['message']}`);
    }
};

export default dbConnection;

export { dbConnection, dbClose }
