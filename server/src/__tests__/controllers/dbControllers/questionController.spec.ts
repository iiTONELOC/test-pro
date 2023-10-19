import { expect, test, describe, beforeAll, afterAll } from 'bun:test';
import { questionController } from '../../../controllers/dbControllers';
import { dbConnection, dbClose } from '../../../db/connection'
import { Question, Topic } from '../../../db/models';
import { Types } from 'mongoose';


import type { IQuestion, PopulatedQuestionModelType, QuestionTypeEnums, TopicModelType } from '../../../db/types';
import type { IQuestionController } from '../../../controllers/types';

let testTopic: TopicModelType | null = null;

beforeAll(async () => {
    await dbConnection(process.env.TEST_DB_NAME);
    testTopic = await Topic.create({ name: 'test' });
});

afterAll(async () => {
    await Topic.deleteMany({});
    await Question.deleteMany({});
    await dbClose();
});

describe('Question Controller', () => {
    test('It should be defined and have all methods described in the interface', () => {
        const QC: IQuestionController = questionController;
        expect(QC).toBeDefined();
        expect(QC.getAllQuestions).toBeDefined();
        expect(QC.getQuestionById).toBeDefined();
        expect(QC.createQuestion).toBeDefined();
        expect(QC.updateQuestionById).toBeDefined();
        expect(QC.deleteQuestionById).toBeDefined();
    });

    describe('getAllQuestions()', () => {
        test('It should return an array of questions', async () => {
            const questions = await questionController.getAllQuestions();
            expect(questions).toBeDefined();
            expect(questions).toBeInstanceOf(Array);
        });
    });

    describe('getQuestionById()', () => {
        test('It should return a question', async () => {
            const testQuestionData: IQuestion = {
                questionType: 'MultipleChoice' as QuestionTypeEnums.MultipleChoice,
                question: 'What is the meaning of life?',
                topics: [testTopic?._id as unknown as Types.ObjectId],
                options: ['42', '43', '44', '45'],
                answer: '42',
                explanation: '42',
                areaToReview: ['42']
            };
            const testQuestion = await Question.create(testQuestionData);
            const question = await questionController.getQuestionById(testQuestion._id.toString());

            expect(question).toBeDefined();
            expect(question).toBeInstanceOf(Object);
            expect(question?.questionType).toBe('MultipleChoice');
            expect(question?.question).toBe('What is the meaning of life?');
            expect(question?.topics[0]?.name).toBe('test');
        });

        test('It should return null if no question is found', async () => {
            const question = await questionController.getQuestionById(new Types.ObjectId().toString());
            expect(question).toBeNull();
        });
    });

    describe('createQuestion()', () => {
        test('It should create a question', async () => {
            const testQuestionData: IQuestion = {
                questionType: 'MultipleChoice' as QuestionTypeEnums.MultipleChoice,
                question: 'What is the meaning of life?',
                topics: [testTopic?._id as unknown as Types.ObjectId],
                options: ['42', '43', '44', '45'],
                answer: '42',
                explanation: '42',
                areaToReview: ['42']
            };

            const question: PopulatedQuestionModelType = await questionController.createQuestion(testQuestionData);

            expect(question).toBeDefined();
            expect(question).toBeInstanceOf(Object);
            expect(question.questionType).toBe('MultipleChoice');
            expect(question.question).toBe('What is the meaning of life?');
            expect(question.topics[0].name).toBe('test');
        });
    });

    describe('updateQuestionById()', () => {
        test('It should update a question', async () => {
            const question = await Question.findOne({ question: 'What is the meaning of life?' });
            const updatedQuestion = await questionController.updateQuestionById(
                question?._id?.toString() as string,
                { question: 'What is the meaning of life, the universe, and everything?' }
            );

            expect(updatedQuestion).toBeDefined();
            expect(updatedQuestion).toBeInstanceOf(Object);
            expect(updatedQuestion?.questionType).toBe('MultipleChoice');
            expect(updatedQuestion?.question).toBe('What is the meaning of life, the universe, and everything?');
            expect(updatedQuestion?.topics[0]?.name).toBe('test');
        });

        test('It should return null if no question is found', async () => {
            const updatedQuestion = await questionController.updateQuestionById(
                new Types.ObjectId().toString(),
                { question: 'What is the meaning of life, the universe, and everything?' }
            );
            expect(updatedQuestion).toBeNull();
        });
    });

    describe('deleteQuestionById()', () => {
        test('It should delete a question', async () => {
            const question = await Question.findOne({ question: 'What is the meaning of life, the universe, and everything?' });
            const deletedQuestion = await questionController.deleteQuestionById(question?._id?.toString() as string);

            expect(deletedQuestion).toBeDefined();
            expect(deletedQuestion).toBeInstanceOf(Object);
            expect(deletedQuestion?.questionType).toBe('MultipleChoice');
            expect(deletedQuestion?.question).toBe('What is the meaning of life, the universe, and everything?');
            expect(deletedQuestion?.topics[0]?.name).toBe('test');

            const didQuestionDelete = await questionController.getQuestionById(question?._id?.toString() as string);
            expect(didQuestionDelete).toBeNull();
        });

        test('It should return null if no question is found', async () => {
            const deletedQuestion = await questionController.deleteQuestionById(new Types.ObjectId().toString());
            expect(deletedQuestion).toBeNull();
        });
    });
});
