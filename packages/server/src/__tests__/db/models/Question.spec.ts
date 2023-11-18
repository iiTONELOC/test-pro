import { afterAll, beforeAll, expect, test } from '@jest/globals';
import { dbConnection, dbClose } from '../../../db/connection';

import { Topic, Question } from '../../../db/models';
import type { TopicModelType, QuestionModelType, PopulatedQuestionModelType } from '../../../db/types';


beforeAll(async () => {
    await dbConnection(process.env.TEST_DB_NAME);
});

afterAll(async () => {
    await Topic.deleteMany({});
    await Question.deleteMany({});
    await dbClose();
});

test('QuestionModel', async () => {
    try {
        // Create a new topic
        await Topic.create({ name: 'test' });

        // look up the topic to get the _id
        const createdTopic: TopicModelType | null = await Topic.findOne({ name: 'test' });
        const testTopicId = createdTopic?._id;

        // create a test question
        const newTestQuestion: PopulatedQuestionModelType = await Question.create({
            questionType: 'MultipleChoice',
            question: 'test',
            topics: [testTopicId],
            options: ['test', 'test option 2', 'test option 3', 'test option 4'],
            answer: 'test',
            explanation: 'test',
            areaToReview: ['test']
        }).then((question: QuestionModelType) => question.populate('topics'));

        expect(newTestQuestion).toBeDefined();
        expect(newTestQuestion?.questionType).toBe('MultipleChoice');
        expect(newTestQuestion?.question).toBe('test');
        expect(newTestQuestion?.topics[0].name).toBe('test');
        expect(newTestQuestion?.options[0]).toBe('test');
        expect(newTestQuestion?.answer).toBe('test');
        expect(newTestQuestion?.explanation).toBe('test');
        expect(newTestQuestion?.areaToReview[0]).toBe('test');

    } catch (error) {
        console.log(error);
        return Promise.reject(error);
    }
});
