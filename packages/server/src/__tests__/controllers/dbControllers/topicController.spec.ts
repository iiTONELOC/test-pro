import { expect, test, describe, beforeAll, afterAll } from 'bun:test';
import { topicController } from '../../../controllers/dbControllers';
import type { ITopicController } from '../../../controllers/types';
import { dbConnection, dbClose } from '../../../db/connection'
import { Topic } from '../../../db/models';
import { Types } from 'mongoose';


beforeAll(async () => {
    await dbConnection(process.env.TEST_DB_NAME);
});

afterAll(async () => {
    await Topic.deleteMany({});
    await dbClose()
});

const testTopicList = [
    'testTopic1'
];

const getTestTopic1ByName = async () => {
    const testTopic = await Topic.findOne({ name: testTopicList[0] });
    const testTopicId = testTopic?._id;

    if (!testTopicId)
        throw new Error('testTopicId not found');

    // set this for use in other tests during this run
    testID = testTopicId?.toString() ?? null;
};

let testID: string | null = null;

describe('Topic Controller', () => {
    test('It should be defined and have all methods described in the interface', () => {
        const TC: ITopicController = topicController;
        expect(TC).toBeDefined();
        expect(TC.create).toBeDefined();
        expect(TC.getAll).toBeDefined();
        expect(TC.getById).toBeDefined();
        expect(TC.updateById).toBeDefined();
        expect(TC.deleteById).toBeDefined();
    });

    describe('create()', () => {
        test('It should create a new topic', async () => {
            const newTopic = await topicController.create(testTopicList[0]);
            expect(newTopic).toBeDefined();
            expect(newTopic).toHaveProperty('name', testTopicList[0]);
        });

        test('It should throw an error if the topic already exists', async () => {
            try {
                await topicController.create(testTopicList[0]);
            } catch (err: any) {
                expect(err).toBeDefined();
                expect(err).toHaveProperty('message');
                expect(err?.message).toEqual('E11000 duplicate key error collection: test-pro-test-db.topics index: name_1 dup key: { name: \"testTopic1\" }');
            }
        });

        test('It should only accept an alpha-numeric string as a topic name', async () => {
            let assertions = 0;
            // only alpha-numeric (with white-space) strings should be accepted
            // Mongoose will attempt to convert the value to a string if possible
            // So numbers like 123 would be valid and converted to '123' etc.
            const invalidTopicList = [
                'testTopic1!',
                { name: 'testTopic1' },
                ['testTopic1']
            ];

            // attempt to create a topic with each invalid topic name
            // we track the number of assertions to ensure that each topic name
            // fails validation
            for (const topic of invalidTopicList) {
                try {
                    // @ts-ignore
                    await topicController.create(topic);
                } catch (err: any) {
                    expect(err).toBeDefined();
                    expect(err).toHaveProperty('message');
                    assertions++;
                }
            }
            expect(assertions).toEqual(invalidTopicList.length);
        });
    });

    describe('getAll()', () => {
        test('It should return an array of all topics', async () => {
            const topics = await topicController.getAll();

            expect(topics).toBeDefined();
            expect(topics).toHaveLength(1);
            expect(topics[0]).toHaveProperty('name', testTopicList[0]);
        });
    });

    describe('getById()', () => {
        test('It should return a topic by a valid topic id', async () => {
            await getTestTopic1ByName();
            const topic = await topicController.getById(testID as string);

            expect(topic).toBeDefined();
            expect(topic).toHaveProperty('name', testTopicList[0]);
        });

        test('It should return null if no topic is found', async () => {
            const topic = await topicController.getById(new Types.ObjectId().toString());
            expect(topic).toBeNull();
        });
    });

    describe('updateById()', () => {
        test('It should update a topic by a valid topic id', async () => {
            const runTest = async () => {
                const updatedTopic = await topicController
                    .updateById(testID as string, 'Updated Topic Name Test');

                expect(updatedTopic).toBeDefined();
                expect(updatedTopic).toHaveProperty('name', 'Updated Topic Name Test');
            };

            if (testID !== null) {
                await runTest();
            } else {
                await getTestTopic1ByName();
                await runTest();
            }
            // reset the topic name
            await topicController.updateById(testID as string, testTopicList[0]);
        });
    });

    describe('deleteById()', () => {
        test('It should delete a topic by a valid topic id', async () => {
            await getTestTopic1ByName();
            const deletedTopic = await topicController.deleteById(testID as string);

            expect(deletedTopic).toBeDefined();
            expect(deletedTopic).toHaveProperty('name', testTopicList[0]);
        });

        test('It should return null if no topic is found', async () => {
            const topic = await topicController.deleteById(new Types.ObjectId().toString());
            expect(topic).toBeNull();
        });
    });
});
