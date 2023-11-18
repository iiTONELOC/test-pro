import { expect, test, describe, beforeAll, afterAll } from '@jest/globals';
import { quizController, topicController, questionController } from '../../../controllers/dbControllers';
import { Question, Topic, Quiz, QuestionTypeEnums } from '../../../db/models';
import { dbConnection, dbClose } from '../../../db/connection'
import { Types } from 'mongoose';

import { IQuiz, IQuestion, ITopic, PopulatedQuizModel, TopicModelType, PopulatedQuestionModelType, QuizModelType, } from '../../../db/types';
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
    const testTopic: TopicModelType = await topicController.create(testTopicData.name);
    const testTopicId: Types.ObjectId = testTopic._id;

    // add the topic id to the testQuestionData
    testQuestionData.topics.push(testTopicId);

    // create a question
    const testQuestion: PopulatedQuestionModelType = await questionController.create(testQuestionData, {
        showTimestamps: false,
        needToPopulate: true
    }) as PopulatedQuestionModelType;
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
        expect(QC.create).toBeDefined();
        expect(QC.getAll).toBeDefined();
        expect(QC.getById).toBeDefined();
        expect(QC.updateById).toBeDefined();
        expect(QC.deleteById).toBeDefined();
    });

    describe('create', () => {
        test('It should create a quiz', async () => {
            const newQuiz: PopulatedQuizModel = await quizController.create({ ...testQuizData }, {
                showTimestamps: false,
                needToPopulate: true
            }) as PopulatedQuizModel;

            expect(newQuiz).toBeDefined();
            expect(newQuiz.name).toEqual(testQuizData.name);
            expect(newQuiz.questions.length).toEqual(1);
            expect(newQuiz.topics.length).toEqual(1);
        });

        test('It should throw an error if data is missing', async () => {
            try {
                // @ts-expect-error
                await quizController.create();
            } catch (err: any) {
                expect(err).toBeDefined();
            }
        });
    });

    describe('getAll', () => {
        test('It should get all quizzes', async () => {
            const quizzes: QuizModelType[] = await quizController.getAll({
                showTimestamps: false,
                needToPopulate: false
            }) as QuizModelType[];

            expect(quizzes).toBeDefined();
            expect(quizzes.length).toEqual(1);
        });
    });

    describe('getById', () => {
        test('It should get a quiz by id', async () => {
            const quizzes: QuizModelType[] = await quizController.getAll({
                showTimestamps: false,
                needToPopulate: false
            }) as QuizModelType[];

            const quizId: Types.ObjectId = quizzes[0]._id;
            const quiz: QuizModelType | null = await quizController.getById(quizId.toString(), {
                showTimestamps: false,
                needToPopulate: false
            });
            expect(quiz).toBeDefined();
            expect(quiz?.name).toEqual(testQuizData.name);
            expect(quiz?.questions.length).toEqual(1);
            expect(quiz?.topics.length).toEqual(1);
        });

        test('It should return null if quiz is not found', async () => {
            const quiz: QuizModelType | null = await quizController.getById('123456789012', {
                showTimestamps: false,
                needToPopulate: false
            });

            expect(quiz).toBeNull();
        });
    });

    describe('updateById', () => {
        test('It should update a quiz by id', async () => {
            const quizzes: QuizModelType[] = await quizController.getAll({
                showTimestamps: false,
                needToPopulate: false
            });
            const quizId: Types.ObjectId = quizzes[0]._id;
            const updatedQuiz: QuizModelType | null = await quizController
                .updateById(quizId.toString(), { name: 'updatedQuiz' }, {
                    showTimestamps: false,
                    needToPopulate: false
                });
            expect(updatedQuiz).toBeDefined();
            expect(updatedQuiz?.name).toEqual('updatedQuiz');
            expect(updatedQuiz?.questions.length).toEqual(1);
            expect(updatedQuiz?.topics.length).toEqual(1);
        });

        test('It should return null if quiz is not found', async () => {
            const updatedQuiz: QuizModelType | null = await quizController
                .updateById('123456789012', { name: 'updatedQuiz' }, {
                    showTimestamps: false,
                    needToPopulate: false
                });
            expect(updatedQuiz).toBeNull();
        });

        test('It should throw an error if data is missing', async () => {
            try {
                const quizzes: PopulatedQuizModel[] = await quizController.getAll({
                    showTimestamps: false,
                    needToPopulate: true
                }) as PopulatedQuizModel[];

                const quizId: Types.ObjectId = quizzes[0]._id;
                // @ts-expect-error
                await quizController.updateById(quizId.toString());
            } catch (err: any) {
                expect(err).toBeDefined();
            }
        });
    });
});

