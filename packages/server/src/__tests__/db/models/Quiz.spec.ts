import { afterAll, beforeAll, expect, test } from 'bun:test';
import { dbConnection, dbClose } from '../../../db/connection';

import { Topic, Quiz, Question } from '../../../db/models';
import type {
    TopicModelType, QuizModelType, PopulatedQuizModel,
    QuestionModelType, PopulatedQuestionModelType
} from '../../../db/types';


beforeAll(async () => {
    await dbConnection(process.env.TEST_DB_NAME);
});

afterAll(async () => {
    await Topic.deleteMany({});
    await Quiz.deleteMany({});
    await Question.deleteMany({});
    await dbClose();
});

test('QuizModel', async () => {
    try {
        // create a test topic and test question to use in the quiz

        // Create a new topic
        const testTopic: TopicModelType = await Topic.create({ name: 'tests' })
            .then((topic: TopicModelType) => topic);

        // Create a new question
        const testQuestion: PopulatedQuestionModelType = await Question.create({
            questionType: 'MultipleChoice',
            question: 'test',
            topics: [testTopic._id],
            options: ['test', 'test option 2', 'test option 3', 'test option 4'],
            answer: 'test',
            explanation: 'test',
            areaToReview: ['test']
        }).then((question: QuestionModelType) => question.populate(['topics']));

        // create a test quiz
        const newTestQuiz: PopulatedQuizModel = await Quiz.create({
            name: 'test',
            topics: [testTopic._id],
            questions: [testQuestion._id]
        }).then((quiz: QuizModelType) => quiz.populate([
            { path: 'topics', select: ['-createdAt', '-updatedAt', '-__v'] },
            {
                path: 'questions', select: ['-createdAt', '-updatedAt', '-__v'],
                populate: { path: 'topics', select: ['-createdAt', '-updatedAt', '-__v'] }
            }
        ]));

        expect(newTestQuiz).toBeDefined();
        expect(newTestQuiz?.name).toBe('test');
        expect(newTestQuiz?.topics[0].name).toBe('tests');
        expect(newTestQuiz?.questions[0].question).toBe('test');
    } catch (error) {
        console.log(error);
        return Promise.reject(error);
    }
});
