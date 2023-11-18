import { afterAll, beforeAll, expect, test } from '@jest/globals';
import TopicModel, { TopicModelType } from '../../../db/models/Topic';
import { dbConnection, dbClose } from '../../../db/connection';

beforeAll(async () => {
    await dbConnection(process.env.TEST_DB_NAME);
});

afterAll(async () => {
    await TopicModel.deleteMany({});
    await dbClose();
});

test('TopicModel', async () => {
    try {
        await TopicModel.create({ name: 'test' });

        // look up the topic
        const createdTopic: TopicModelType | null = await TopicModel.findOne({ name: 'test' });
        expect(createdTopic).toBeDefined();
        expect(createdTopic?.name).toBe('test');
        expect(createdTopic?.createdAt).toBeInstanceOf(Date);
        expect(createdTopic?.updatedAt).toBeInstanceOf(Date);

        // remove the topic
        await TopicModel.findByIdAndDelete(createdTopic?._id);

        expect(await TopicModel.findOne({ name: 'test' })).toBeNull();
    } catch (error) {
        console.log(error);
        return Promise.reject(error);
    }
});
