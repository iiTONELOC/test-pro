import { expect, test } from 'bun:test';
import { startServer } from './index';

test('startServer', async () => {
    try {
        const callback = () => {
            console.log('test server callback');
        }
        await startServer(callback);
        const serverResponse = await fetch('http://localhost:3000');
        const responseStatus = serverResponse.status;
        expect(responseStatus).toBe(200);
        expect(true).toBe(true);
    } catch (error) {
        console.log(error);
        expect(true).toBe(false);
    }
});
