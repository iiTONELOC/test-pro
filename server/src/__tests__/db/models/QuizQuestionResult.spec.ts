import { afterAll, beforeAll, expect, test } from 'bun:test';
import { dbConnection, dbClose } from '../../../db/connection';

import mongoose from 'mongoose';
import { QuizQuestionResult } from '../../../db/models';
import type { QuizQuestionResultType } from '../../../db/types';

beforeAll(async () => {
    await dbConnection(process.env.TEST_DB_NAME);
});

afterAll(async () => {
    await QuizQuestionResult.deleteMany({});
    await dbClose();
});

test('QuizQuestionResultModel', async () => {
    try {
        const quizId = new mongoose.Types.ObjectId();
        const questionId = new mongoose.Types.ObjectId();
        const selectedAnswer = 'test';
        const isCorrect = true;

        const newQuizQuestionResult: QuizQuestionResultType = await QuizQuestionResult.create({
            quiz: quizId,
            question: questionId,
            selectedAnswer,
            isCorrect
        }).then(data => data);

        expect(newQuizQuestionResult).toBeDefined();
        expect(newQuizQuestionResult.quiz).toBe(quizId);
        expect(newQuizQuestionResult.question).toBe(questionId);
        expect(newQuizQuestionResult.selectedAnswer).toBe(selectedAnswer);
        expect(newQuizQuestionResult.isCorrect).toBe(isCorrect);
    } catch (error) {
        console.log(error);
        return Promise.reject(error);
    }
});
