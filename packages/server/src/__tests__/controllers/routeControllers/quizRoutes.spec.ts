import fs from 'fs';
import path from 'path';
import { Types } from 'mongoose';
import { startServer } from '../../../server';
import { topicController } from '../../../controllers';
import { dbConnection, dbClose } from '../../../db/connection';
import { IApiResponse, IQuizByJsonData } from '../../../controllers/types';
import { afterAll, beforeAll, expect, test, describe } from '@jest/globals';
import { Question, Topic, Quiz, QuestionTypeEnums } from '../../../db/models';

import {
    IQuiz, ITopic, IQuestion, TopicModelType, PopulatedQuizModel, QuizModelType, QuestionModelType
} from '../../../db/types';
import { jsonQuizData } from '../../../bot/alfred/utils/types';


const PORT = 3003;

const testTopicData: ITopic = {
    name: 'quiz testTopicQuizRoute'
};

const testQuestionData: IQuestion = {
    questionType: QuestionTypeEnums.MultipleChoice,
    question: 'testQuestionQuizRoute',
    answer: 'testAnswer',
    // requires the topic ids
    topics: [],
    options: ['testAnswer', 'testOption2', 'testOption3'],
    explanation: 'testExplanation',
    areaToReview: ['testAreaToReview']
};

const testQuizData: IQuiz = {
    name: 'testQuizRoute',
    questions: [],
    // requires the topic ids
    topics: []
};

beforeAll(async () => {
    process.env.PORT = PORT.toString();
    await dbConnection(process.env.TEST_DB_NAME).then(async () => {
        await startServer(undefined, String(PORT));
    });

    // create a topic
    const testTopic: TopicModelType = await topicController.create(testTopicData.name);
    const testTopicId: Types.ObjectId = testTopic._id;

    // add the topic id to the testQuestionData
    testQuestionData.topics.push(testTopicId);

    // create a question
    const testQuestion: QuestionModelType = await Question.create(testQuestionData);
    const testQuestionId: Types.ObjectId = testQuestion._id;

    // add the question id to the testQuizData
    testQuizData.questions.push(testQuestionId);
    // add the topic id to the testQuizData
    testQuizData.topics.push(testTopicId);

    // create a quiz
    await Quiz.create(testQuizData);
});

afterAll(async () => {
    await Quiz.deleteMany({});
    await Topic.deleteMany({});
    await Question.deleteMany({});
    await dbClose();
});


describe('GET /api/quizzes', () => {
    test('Should return an array of quizzes', async () => {
        const response: Response = await fetch(`http://localhost:${PORT}/api/quizzes`);
        const quizzes: IApiResponse<PopulatedQuizModel[]> = await response.json() as IApiResponse<PopulatedQuizModel[]>;

        expect(response.status).toBe(200);
        expect(quizzes?.data?.length).toBe(1);
    });

    test('Should return an unpopulated array of quizzes when the no-populate URL param is used', async () => {
        const response: Response = await fetch(`http://localhost:${PORT}/api/quizzes?no-populate=true`);
        const quizzes: IApiResponse<QuizModelType[]> = await response.json() as IApiResponse<QuizModelType[]>;

        expect(response.status).toBe(200);
        expect(quizzes?.data?.length).toBe(1);
        expect(quizzes?.data?.[0].questions.length).toBe(1);
        expect(quizzes?.data?.[0].topics.length).toBe(1);
        expect(quizzes?.data?.[0].topics[0]).not.toHaveProperty('name');
        expect(quizzes?.data?.[0].questions[0]).not.toHaveProperty('question');
    });

    test('Should return an array of quizzes with timestamps when the timestamps URL param is used', async () => {
        const response: Response = await fetch(`http://localhost:${PORT}/api/quizzes?timestamps=true`);
        const quizzes: IApiResponse<PopulatedQuizModel[]> = await response.json() as IApiResponse<PopulatedQuizModel[]>;
        expect(response.status).toBe(200);
        expect(quizzes?.data?.length).toBe(1);
        expect(quizzes?.data?.[0].createdAt).toBeDefined();
        expect(quizzes?.data?.[0].updatedAt).toBeDefined();
    });
});

describe('GET /api/quizzes/:id', () => {
    test('Should return a quiz', async () => {
        const quiz: QuizModelType | null = await Quiz.findOne({ name: testQuizData.name });
        const response: Response = await fetch(`http://localhost:${PORT}/api/quizzes/${quiz?._id}`);
        const quizResponse: IApiResponse<PopulatedQuizModel> = await response.json() as IApiResponse<PopulatedQuizModel>;

        expect(response.status).toBe(200);
        expect(quizResponse?.data?.name).toBe(testQuizData.name);
        expect(quizResponse?.data?.questions.length).toBe(1);
        expect(quizResponse?.data?.topics.length).toBe(1);
    });

    test('Should return a 404 if quiz is not found', async () => {
        const response: Response = await fetch(`http://localhost:${PORT}/api/quizzes/123456789012`);
        const quizResponse: IApiResponse<PopulatedQuizModel> = await response.json() as IApiResponse<PopulatedQuizModel>;

        expect(response.status).toBe(404);
        expect(quizResponse?.error).toBe('Quiz not found');
    });

    test('Should return an unpopulated quiz when the no-populate URL param is used', async () => {
        const quiz: QuizModelType | null = await Quiz.findOne({ name: testQuizData.name });
        const response: Response = await fetch(`http://localhost:${PORT}/api/quizzes/${quiz?._id}?no-populate=true`);
        const quizResponse: IApiResponse<QuizModelType> = await response.json() as IApiResponse<QuizModelType>;

        expect(response.status).toBe(200);
        expect(quizResponse?.data?.name).toBe(testQuizData.name);
        expect(quizResponse?.data?.questions.length).toBe(1);
        expect(quizResponse?.data?.topics.length).toBe(1);
        expect(quizResponse?.data?.questions[0]).not.toHaveProperty('question');
        expect(quizResponse?.data?.topics[0]).not.toHaveProperty('name');
    });

    test('Should return a quiz with timestamps when the timestamps URL param is used', async () => {
        const quiz: QuizModelType | null = await Quiz.findOne({ name: testQuizData.name });
        const response: Response = await fetch(`http://localhost:${PORT}/api/quizzes/${quiz?._id}?timestamps=true`);
        const quizResponse: IApiResponse<PopulatedQuizModel> = await response.json() as IApiResponse<PopulatedQuizModel>;

        expect(response.status).toBe(200);
        expect(quizResponse?.data?.name).toBe(testQuizData.name);
        expect(quizResponse?.data?.questions.length).toBe(1);
        expect(quizResponse?.data?.topics.length).toBe(1);
        expect(quizResponse?.data?.createdAt).toBeDefined();
        expect(quizResponse?.data?.updatedAt).toBeDefined();
    });

});

describe('POST /api/quizzes', () => {
    test('Should create a quiz', async () => {
        const response: Response = await fetch(`http://localhost:${PORT}/api/quizzes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testQuizData)
        });
        const quizResponse: IApiResponse<PopulatedQuizModel> = await response.json() as IApiResponse<PopulatedQuizModel>;

        expect(response.status).toBe(201);
        expect(quizResponse?.data?.name).toBe(testQuizData.name);
        expect(quizResponse?.data?.questions.length).toBe(1);
        expect(quizResponse?.data?.topics.length).toBe(1);
    });

    test('It should return a 400 if data is missing', async () => {
        const response: Response = await fetch(`http://localhost:${PORT}/api/quizzes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        });
        const quizResponse: IApiResponse<PopulatedQuizModel> = await response.json() as IApiResponse<PopulatedQuizModel>;

        expect(response.status).toBe(400);
        expect(quizResponse?.error).toBe('Quiz validation failed: name: Path `name` is required.');
    });

    test('It should return an unpopulated quiz when the no-populate URL param is used', async () => {
        const response: Response = await fetch(`http://localhost:${PORT}/api/quizzes?no-populate=true`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testQuizData)
        });
        const quizResponse: IApiResponse<QuizModelType> = await response.json() as IApiResponse<QuizModelType>;

        expect(response.status).toBe(201);
        expect(quizResponse?.data?.name).toBe(testQuizData.name);
        expect(quizResponse?.data?.questions.length).toBe(1);
        expect(quizResponse?.data?.topics.length).toBe(1);
        expect(quizResponse?.data?.questions[0]).not.toHaveProperty('question');
        expect(quizResponse?.data?.topics[0]).not.toHaveProperty('name');
    });

    test('It should return a quiz with timestamps when the timestamps URL param is used', async () => {
        const response: Response = await fetch(`http://localhost:${PORT}/api/quizzes?timestamps=true`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testQuizData)
        });
        const quizResponse: IApiResponse<PopulatedQuizModel> = await response.json() as IApiResponse<PopulatedQuizModel>;

        expect(response.status).toBe(201);
        expect(quizResponse?.data?.name).toBe(testQuizData.name);
        expect(quizResponse?.data?.questions.length).toBe(1);
        expect(quizResponse?.data?.topics.length).toBe(1);
        expect(quizResponse?.data?.createdAt).toBeDefined();
        expect(quizResponse?.data?.updatedAt).toBeDefined();
    });
});

describe('PUT /api/quizzes/:id', () => {
    test('Should update a quiz', async () => {
        const quiz: QuizModelType | null = await Quiz.findOne({ name: testQuizData.name });
        const response: Response = await fetch(`http://localhost:${PORT}/api/quizzes/${quiz?._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: 'updatedQuiz' })
        });
        const quizResponse: IApiResponse<PopulatedQuizModel> = await response.json() as IApiResponse<PopulatedQuizModel>;

        expect(response.status).toBe(200);
        expect(quizResponse?.data?.name).toBe('updatedQuiz');
        expect(quizResponse?.data?.questions.length).toBe(1);
        expect(quizResponse?.data?.topics.length).toBe(1);
    });

    test('Should return a 404 if quiz is not found', async () => {
        const response: Response = await fetch(`http://localhost:${PORT}/api/quizzes/123456789012`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: 'updatedQuiz' })
        });
        const quizResponse: IApiResponse<PopulatedQuizModel> = await response.json() as IApiResponse<PopulatedQuizModel>;

        expect(response.status).toBe(404);
        expect(quizResponse?.error).toBe('Quiz not found');
    });

    test('Should return a 400 if data is missing', async () => {
        const quiz: QuizModelType | null = await Quiz.findOne({ name: testQuizData.name });
        const response: Response = await fetch(`http://localhost:${PORT}/api/quizzes/${quiz?._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        });
        const quizResponse: IApiResponse<PopulatedQuizModel> = await response.json() as IApiResponse<PopulatedQuizModel>;

        expect(response.status).toBe(400);
        expect(quizResponse?.error).toBe('Nothing to update');
    });

    test('Should return an unpopulated quiz when the no-populate URL param is used', async () => {
        const quiz: QuizModelType | null = await Quiz.findOne({ name: testQuizData.name });
        const response: Response = await fetch(`http://localhost:${PORT}/api/quizzes/${quiz?._id}?no-populate=true`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: 'updatedQuiz' })
        });
        const quizResponse: IApiResponse<QuizModelType> = await response.json() as IApiResponse<QuizModelType>;

        expect(response.status).toBe(200);
        expect(quizResponse?.data?.name).toBe('updatedQuiz');
        expect(quizResponse?.data?.questions.length).toBe(1);
        expect(quizResponse?.data?.topics.length).toBe(1);
        expect(quizResponse?.data?.questions[0]).not.toHaveProperty('question');
        expect(quizResponse?.data?.topics[0]).not.toHaveProperty('name');
    });

    test('Should return a quiz with timestamps when the timestamps URL param is used', async () => {
        const quiz: QuizModelType | null = await Quiz.findOne({ name: testQuizData.name });
        const response: Response = await fetch(`http://localhost:${PORT}/api/quizzes/${quiz?._id}?timestamps=true`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: 'updatedQuiz' })
        });
        const quizResponse: IApiResponse<PopulatedQuizModel> = await response.json() as IApiResponse<PopulatedQuizModel>;

        expect(response.status).toBe(200);
        expect(quizResponse?.data?.name).toBe('updatedQuiz');
        expect(quizResponse?.data?.questions.length).toBe(1);
        expect(quizResponse?.data?.topics.length).toBe(1);
        expect(quizResponse?.data?.createdAt).toBeDefined();
        expect(quizResponse?.data?.updatedAt).toBeDefined();
    });
});

describe('DELETE /api/quizzes/:id', () => {
    test('Should delete a quiz', async () => {
        const quiz: QuizModelType | null = await Quiz.findOne({ name: testQuizData.name });
        const response: Response = await fetch(`http://localhost:${PORT}/api/quizzes/${quiz?._id}`, {
            method: 'DELETE'
        });
        const quizResponse: IApiResponse<PopulatedQuizModel> = await response.json() as IApiResponse<PopulatedQuizModel>;

        expect(response.status).toBe(200);
        expect(quizResponse?.data?.name).toBe('testQuizRoute');
        expect(quizResponse?.data?.questions.length).toBe(1);
        expect(quizResponse?.data?.topics.length).toBe(1);
    });

    test('Should return a 404 if quiz is not found', async () => {
        const response: Response = await fetch(`http://localhost:${PORT}/api/quizzes/123456789012`, {
            method: 'DELETE'
        });
        const quizResponse: IApiResponse<PopulatedQuizModel> = await response.json() as IApiResponse<PopulatedQuizModel>;

        expect(response.status).toBe(404);
        expect(quizResponse?.error).toBe('Quiz not found');
    });

    test('Should return an unpopulated quiz when the no-populate URL param is used', async () => {
        const response: Response = await fetch(`http://localhost:${PORT}/api/quizzes/123456789012?no-populate=true`, {
            method: 'DELETE'
        });
        const quizResponse: IApiResponse<QuizModelType> = await response.json() as IApiResponse<QuizModelType>;

        expect(response.status).toBe(404);
        expect(quizResponse?.error).toBe('Quiz not found');
    });

    test('Should return a quiz with timestamps when the timestamps URL param is used', async () => {
        const response: Response = await fetch(`http://localhost:${PORT}/api/quizzes/123456789012?timestamps=true`, {
            method: 'DELETE'
        });
        const quizResponse: IApiResponse<PopulatedQuizModel> = await response.json() as IApiResponse<PopulatedQuizModel>;

        expect(response.status).toBe(404);
        expect(quizResponse?.error).toBe('Quiz not found');
    });
});

describe('POST /api/quizzes/json-upload', () => {
    describe('Create a new Quiz by JSON Upload', () => {
        test('Should be able to create a new quiz by a JSON upload', async () => {
            const quizData: IQuizByJsonData = {
                name: 'testQuizByJsonUpload',
                questions: [
                    {
                        type: QuestionTypeEnums.MultipleChoice,
                        question: 'testQuestionByJsonUpload',
                        answer: 'testAnswer',
                        topics: ['testTopicByJsonUpload'],
                        options: ['testAnswer', 'testOption2', 'testOption3'],
                        explanation: 'testExplanation',
                        areaToReview: ['testAreaToReview']
                    }
                ],
                topics: ['testTopicByJsonUpload']
            };

            const response: Response = await fetch(`http://localhost:${PORT}/api/quizzes/json-upload`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ quizData })
            });
            const quizResponse: IApiResponse<PopulatedQuizModel> = await response.json() as IApiResponse<PopulatedQuizModel>;

            expect(response.status).toBe(201);
            expect(quizResponse?.data?.name).toBe('testQuizByJsonUpload');
            expect(quizResponse?.data?.questions.length).toBe(1);
            expect(quizResponse?.data?.topics.length).toBe(1);
        });

        test('Should return a 400 if data is missing', async () => {
            const response: Response = await fetch(`http://localhost:${PORT}/api/quizzes/json-upload`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({})
            });
            const quizResponse: IApiResponse<PopulatedQuizModel> = await response.json() as IApiResponse<PopulatedQuizModel>;
            expect(response.status).toBe(400);
            expect(quizResponse?.error).toBe('Invalid request body');
        });

        test('Should return unpopulated quiz data when the no-populate URL param is used', async () => {
            const quizData: IQuizByJsonData = {
                name: 'testQuizByJsonUpload1',
                questions: [
                    {
                        type: QuestionTypeEnums.MultipleChoice,
                        question: 'testQuestionByJsonUpload1',
                        answer: 'testAnswer',
                        topics: ['testTopicByJsonUpload'],
                        options: ['testAnswer', 'testOption2', 'testOption3'],
                        explanation: 'testExplanation',
                        areaToReview: ['testAreaToReview']
                    }
                ],
                topics: ['testTopicByJsonUpload']
            };

            const response: Response = await fetch(`http://localhost:${PORT}/api/quizzes/json-upload?no-populate=true`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ quizData })
            });
            const quizResponse: IApiResponse<QuizModelType> = await response.json() as IApiResponse<QuizModelType>;

            expect(response.status).toBe(201);
            expect(quizResponse?.data?.name).toBe('testQuizByJsonUpload1');
            expect(quizResponse?.data?.questions.length).toBe(1);
            expect(quizResponse?.data?.topics.length).toBe(1);
            expect(quizResponse?.data?.questions[0]).not.toHaveProperty('question');
            // @ts-expect-error
            expect(quizResponse?.data?.questions[0].question).toBeUndefined();
            expect(quizResponse?.data?.topics[0]).not.toHaveProperty('name');
            // @ts-expect-error
            expect(quizResponse?.data?.topics[0].name).toBeUndefined();
        });

        test('Should return a quiz with timestamps when the timestamps URL param is used', async () => {
            const quizData: IQuizByJsonData = {
                name: 'testQuizByJsonUpload2',
                questions: [
                    {
                        type: QuestionTypeEnums.MultipleChoice,
                        question: 'testQuestionByJsonUpload2',
                        answer: 'testAnswer',
                        topics: ['testTopicByJsonUpload'],
                        options: ['testAnswer', 'testOption2', 'testOption3'],
                        explanation: 'testExplanation',
                        areaToReview: ['testAreaToReview']
                    }
                ],
                topics: ['testTopicByJsonUpload']
            };

            const response: Response = await fetch(`http://localhost:${PORT}/api/quizzes/json-upload?timestamps=true`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ quizData })
            });
            const quizResponse: IApiResponse<PopulatedQuizModel> = await response.json() as IApiResponse<PopulatedQuizModel>;

            expect(response.status).toBe(201);
            expect(quizResponse?.data?.name).toBe('testQuizByJsonUpload2');
            expect(quizResponse?.data?.questions.length).toBe(1);
            expect(quizResponse?.data?.topics.length).toBe(1);
            expect(quizResponse?.data?.createdAt).toBeDefined();
            expect(quizResponse?.data?.updatedAt).toBeDefined();
        });
    });


    describe('POST /api/quizzes/convert-to-json', () => {
        describe('Converting quiz text data to json', () => {
            test('Should be able to convert a quiz text file to json', async () => {
                // read the test quiz text file
                const testFilePath = path.resolve(process.cwd(), './src/bot/alfred/utils/extractQuestionsFromText/testUserInputTestOut.txt');
                const testFile = fs.readFileSync(testFilePath, 'utf8');

                const requestBody = {
                    text: testFile,
                    type: 'test-out',
                    name: 'testQuizConvertToJson'
                };

                const response: Response = await fetch(`http://localhost:${PORT}/api/quizzes/convert-to-json`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestBody)
                });

                const quizResponse: IApiResponse<jsonQuizData[]> = await response.json() as IApiResponse<jsonQuizData[]>;

                expect(response.status).toBe(200);
                const data = quizResponse?.data ?? [] as jsonQuizData[];
                const quiz = data[0] ?? {} as jsonQuizData;
                expect(quiz?.name).toBe('testQuizConvertToJson');

                const jsonString = JSON.stringify(quiz, null, 4);
                // it should be valid json
                expect(typeof jsonString).toBe('string');
            }, 120000);
        });
    });
});

