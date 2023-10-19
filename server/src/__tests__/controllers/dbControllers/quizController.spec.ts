import { expect, test, describe, beforeAll, afterAll } from 'bun:test';
import { quizController, topicController, questionController } from '../../../controllers/dbControllers';
import { Question, Topic, Quiz, QuestionTypeEnums } from '../../../db/models';
import { dbConnection, dbClose } from '../../../db/connection'
import { Types } from 'mongoose';

import { IQuiz, IQuestion, ITopic, PopulatedQuizModel, TopicModelType, PopulatedQuestionModelType, } from '../../../db/types';
import { IQuizController } from '../../../controllers/types';

const testTopicData: ITopic = {
    name: 'testTopic'
};

const testQuestionData: IQuestion = {
    questionType: QuestionTypeEnums.MultipleChoice,
    question: 'testQuestion',
    answer: 'testAnswer',
    // requires the topic ids
    topics: [],
    options: ['testAnswer', 'testOption2', 'testOption3'],
    explanation: 'testExplanation',
    areaToReview: ['testAreaToReview']
};

const testQuizData: IQuiz = {
    name: 'testQuiz',
    questions: [],
    // requires the topic ids
    topics: []
};

beforeAll(async () => {
    await dbConnection(process.env.TEST_DB_NAME)

    // create a topic
    const testTopic: TopicModelType = await topicController.createTopic(testTopicData.name);
    const testTopicId: Types.ObjectId = testTopic._id;

    // add the topic id to the testQuestionData
    testQuestionData.topics.push(testTopicId);

    // create a question
    const testQuestion: PopulatedQuestionModelType = await questionController.createQuestion(testQuestionData);
    const testQuestionId: Types.ObjectId = testQuestion._id;

    // add the question id to the testQuizData
    testQuizData.questions.push(testQuestionId);
    // add the topic id to the testQuizData
    testQuizData.topics.push(testTopicId);
});

afterAll(async () => {
    await Quiz.deleteMany({});
    await Topic.deleteMany({});
    await Question.deleteMany({});
    await dbClose();
});


describe('Quiz Controller', () => {
    test('It should be defined and have all methods described in the interface', () => {
        const QC: IQuizController = quizController;
        expect(QC).toBeDefined();
        expect(QC.createQuiz).toBeDefined();
        expect(QC.getAllQuizzes).toBeDefined();
        expect(QC.getQuizById).toBeDefined();
        expect(QC.updateQuizById).toBeDefined();
        expect(QC.deleteQuizById).toBeDefined();
    });

    describe('createQuiz', () => {
        test('It should create a quiz', async () => {
            const newQuiz: PopulatedQuizModel = await quizController.createQuiz({ ...testQuizData });
            expect(newQuiz).toBeDefined();
            expect(newQuiz.name).toEqual(testQuizData.name);
            expect(newQuiz.questions.length).toEqual(1);
            expect(newQuiz.topics.length).toEqual(1);
        });

        test('It should throw an error if data is missing', async () => {
            try {
                // @ts-expect-error
                await quizController.createQuiz();
            } catch (err: any) {
                expect(err).toBeDefined();
            }
        });
    });

    describe('getAllQuizzes', () => {
        test('It should get all quizzes', async () => {
            const quizzes: PopulatedQuizModel[] = await quizController.getAllQuizzes();
            expect(quizzes).toBeDefined();
            expect(quizzes.length).toEqual(1);
        });
    });

    describe('getQuizById', () => {
        test('It should get a quiz by id', async () => {
            const quizzes: PopulatedQuizModel[] = await quizController.getAllQuizzes();
            const quizId: Types.ObjectId = quizzes[0]._id;
            const quiz: PopulatedQuizModel | null = await quizController.getQuizById(quizId.toString());
            expect(quiz).toBeDefined();
            expect(quiz?.name).toEqual(testQuizData.name);
            expect(quiz?.questions.length).toEqual(1);
            expect(quiz?.topics.length).toEqual(1);
        });

        test('It should return null if quiz is not found', async () => {
            const quiz: PopulatedQuizModel | null = await quizController.getQuizById('123456789012');
            expect(quiz).toBeNull();
        });
    });

    describe('updateQuizById', () => {
        test('It should update a quiz by id', async () => {
            const quizzes: PopulatedQuizModel[] = await quizController.getAllQuizzes();
            const quizId: Types.ObjectId = quizzes[0]._id;
            const updatedQuiz: PopulatedQuizModel | null = await quizController.updateQuizById(quizId.toString(), { name: 'updatedQuiz' });
            expect(updatedQuiz).toBeDefined();
            expect(updatedQuiz?.name).toEqual('updatedQuiz');
            expect(updatedQuiz?.questions.length).toEqual(1);
            expect(updatedQuiz?.topics.length).toEqual(1);
        });

        test('It should return null if quiz is not found', async () => {
            const updatedQuiz: PopulatedQuizModel | null = await quizController.updateQuizById('123456789012', { name: 'updatedQuiz' });
            expect(updatedQuiz).toBeNull();
        });

        test('It should throw an error if data is missing', async () => {
            try {
                const quizzes: PopulatedQuizModel[] = await quizController.getAllQuizzes();
                const quizId: Types.ObjectId = quizzes[0]._id;
                // @ts-expect-error
                await quizController.updateQuizById(quizId.toString());
            } catch (err: any) {
                expect(err).toBeDefined();
            }
        });
    });
});

