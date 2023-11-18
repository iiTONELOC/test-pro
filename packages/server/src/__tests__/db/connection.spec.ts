import { expect, test } from '@jest/globals';
import { dbConnection, dbClose } from '../../db/connection';

import mongoose from 'mongoose';


// Verifies that the connection is established and the database name is correct
test('dbConnection', async () => {
    const db = await dbConnection();
    expect(db).toBeDefined();
    expect(db.connection.readyState).toBe(1);
    expect(db.connection.host).toBe('localhost');
    expect(db.connection.port).toBe(27017);
    expect(db.connection.name).toBe(process.env.TEST_DB_NAME);
});

// Verifies that the connection is closed
test('dbClose', async () => {
    await dbClose();
    expect(mongoose.connection.readyState).toBe(0);
});
