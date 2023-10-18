import { afterAll, beforeAll, expect, test, describe } from 'bun:test';
import { startServer } from '../../../server';
import { Topic } from '../../../db/models';
import type { TopicModelType } from '../../../db/types';
import { dbConnection, dbClose } from '../../../db/connection';
import { IApiResponse } from '../../../controllers/types';


const PORT = 3001;

beforeAll(async () => {
    process.env.PORT = PORT.toString();

    await dbConnection(process.env.DB_TEST_NAME).then(async () => {
        await Topic.deleteMany({});
        await startServer();
    });
});

afterAll(async () => {
    await Topic.deleteMany({});
    await dbClose();
});

describe('GET /api/topics', async () => {
    test('Get all topics', async () => {
        const response: Response = await fetch(`http://localhost:${PORT}/api/topics`);
        const topics: IApiResponse<TopicModelType[]> = await response.json() as IApiResponse<TopicModelType[]>;

        expect(response.status).toBe(200);
        expect(topics).toEqual({ data: [] });
    });

    test('Get all topics, show timestamps', async () => {
        await Topic.create({ name: 'GetAllTopicsShowTimestamps' });
        const response: Response = await fetch(`http://localhost:${PORT}/api/topics?timestamps=true`);
        const topics: IApiResponse<TopicModelType[]> = await response.json() as IApiResponse<TopicModelType[]>;
        expect(response.status).toBe(200);
        topics.data && expect(topics?.data[0]).toHaveProperty('createdAt');
        topics.data && expect(topics?.data[0]).toHaveProperty('updatedAt');
    });

    test('Get a topic by id', async () => {
        const topic: TopicModelType = await Topic.create({ name: 'GetTopicById' });
        const response: Response = await fetch(`http://localhost:${PORT}/api/topics/${topic._id}`);
        const topicResponse: IApiResponse<TopicModelType> = await response.json() as IApiResponse<TopicModelType>;

        expect(response.status).toBe(200);
        expect(topicResponse.data?.name).toBe('GetTopicById');
    });

    test('Get a topic by invalid id', async () => {
        const response: Response = await fetch(`http://localhost:${PORT}/api/topics/123`);
        const topicResponse: IApiResponse<TopicModelType> = await response.json() as IApiResponse<TopicModelType>;

        expect(response.status).toBe(400);
        expect(topicResponse.data?.name).toBeUndefined();
    });
});

describe('POST /api/topics', async () => {
    test('Create a new topic', async () => {
        const response: Response = await fetch(`http://localhost:${PORT}/api/topics`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'test topic' })
        });
        const topic: IApiResponse<TopicModelType> = await response.json() as IApiResponse<TopicModelType>;

        expect(response.status).toBe(201);
        expect(topic?.data?.name).toBe('test topic');
    });

    test('Create a new topic with invalid name', async () => {
        const response: Response = await fetch(`http://localhost:${PORT}/api/topics`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: '' })
        });
        const topic: IApiResponse<TopicModelType> = await response.json() as IApiResponse<TopicModelType>;

        expect(response.status).toBe(400);
        expect(topic?.data?.name).toBeUndefined();
    });

    test('Create a new topic with duplicate name', async () => {
        const response: Response = await fetch(`http://localhost:${PORT}/api/topics`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'test topic' })
        });
        const topic: IApiResponse<TopicModelType> = await response.json() as IApiResponse<TopicModelType>;

        expect(response.status).toBe(409);
        expect(topic?.data?.name).toBeUndefined();
    });
});

describe('PUT /api/topics', async () => {
    test('Update a topic using a topic id', async () => {
        const topic = await Topic.create({ name: 'UpdateTopicById' });

        const updated = await fetch(`http://localhost:${PORT}/api/topics/${topic._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'TopicById Updated' })
        });

        const updatedTopic: IApiResponse<TopicModelType> = await updated.json() as IApiResponse<TopicModelType>;

        expect(updated.status).toBe(200);
        expect(updatedTopic?.data?.name).toBe('TopicById Updated');
    });
});

describe('DELETE /api/topics', async () => {
    test('Delete a topic using a topic id', async () => {
        const topic = await Topic.create({ name: 'DeleteTopicById' });

        const deleted = await fetch(`http://localhost:${PORT}/api/topics/${topic._id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });

        const deletedTopic: IApiResponse<TopicModelType> = await deleted.json() as IApiResponse<TopicModelType>;

        expect(deleted.status).toBe(200);
        expect(deletedTopic?.data?.name).toBe('DeleteTopicById');
    });
});
