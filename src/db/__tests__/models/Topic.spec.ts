import { afterAll, beforeAll, expect, test } from 'bun:test';
import TopicModel, { TopicModelType } from '../../models/Topic';
import { dbConnection, dbClose } from '../../connection';

beforeAll(async () => {
    await dbConnection(process.env.TEST_DB_NAME);
    return Promise.resolve();
});

afterAll(async () => {
    await TopicModel.deleteMany({});
    await dbClose();
    return Promise.resolve();
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
        return Promise.resolve();
    } catch (error) {
        console.log(error);
        return Promise.reject(error);
    }
});
