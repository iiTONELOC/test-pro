import { afterAll, beforeAll, expect, test, describe } from '@jest/globals';
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


describe('GET /api/topics', () => {
    test('Should return an array of topics', async () => {
        const response: Response = await fetch(`http://localhost:${PORT}/api/topics`);
        const topics: IApiResponse<TopicModelType[]> = await response.json() as IApiResponse<TopicModelType[]>;
        expect(response.status).toBe(200);
        // @ts-ignore
        expect(topics).toEqual({ data: [] });
    });

    test('Should return an array of topics with their timestamps', async () => {
        await Topic.create({ name: 'getAllShowTimestamps' });
        const response: Response = await fetch(`http://localhost:${PORT}/api/topics?timestamps=true`);
        const topics: IApiResponse<TopicModelType[]> = await response.json() as IApiResponse<TopicModelType[]>;
        expect(response.status).toBe(200);
        topics.data && expect(topics?.data[0]).toHaveProperty('createdAt');
        topics.data && expect(topics?.data[0]).toHaveProperty('updatedAt');
    });
});

describe('GET /api/topics/:id', () => {
    test('Get a topic by id', async () => {
        const topic: TopicModelType = await Topic.create({ name: 'getById' });
        const response: Response = await fetch(`http://localhost:${PORT}/api/topics/${topic._id}`);
        const topicResponse: IApiResponse<TopicModelType> = await response.json() as IApiResponse<TopicModelType>;
        expect(response.status).toBe(200);
        expect(topicResponse.data?.name).toBe('getById');
    });

    test('Should return a 400 if not a real ID', async () => {
        const response: Response = await fetch(`http://localhost:${PORT}/api/topics/123`);
        const topicResponse: IApiResponse<TopicModelType> = await response.json() as IApiResponse<TopicModelType>;
        expect(response.status).toBe(400);
        expect(topicResponse.data?.name).toBeUndefined();
    });
});


describe('POST /api/topics', () => {
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

    test('Should return a 400 response if data is invalid or missing', async () => {
        const response: Response = await fetch(`http://localhost:${PORT}/api/topics`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: '' })
        });
        const topic: IApiResponse<TopicModelType> = await response.json() as IApiResponse<TopicModelType>;

        expect(response.status).toBe(400);
        expect(topic?.data?.name).toBeUndefined();
    });

    test('Should return a 409 response if the topic already exists', async () => {
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

describe('PUT /api/topics/:id', () => {
    test('Update a topic', async () => {
        const topic = await Topic.create({ name: 'updateById' });

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

describe('DELETE /api/topics/:id', () => {
    test('Delete a topic', async () => {
        const topic = await Topic.create({ name: 'deleteById' });

        const deleted = await fetch(`http://localhost:${PORT}/api/topics/${topic._id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });

        const deletedTopic: IApiResponse<TopicModelType> = await deleted.json() as IApiResponse<TopicModelType>;

        expect(deleted.status).toBe(200);
        expect(deletedTopic?.data?.name).toBe('deleteById');
    });
});

