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
        const quizAttempt = new mongoose.Types.ObjectId();
        const questionId = new mongoose.Types.ObjectId();
        const selectedAnswer = 'test';
        const isCorrect = true;

        const newQuizQuestionResult: QuizQuestionResultType = await QuizQuestionResult.create({
            quizAttempt,
            question: questionId,
            selectedAnswer,
            isCorrect,
            elapsedTimeInMs: 0
        }).then(data => data);

        expect(newQuizQuestionResult).toBeDefined();
        expect(newQuizQuestionResult.quizAttempt.toString()).toBe(quizAttempt.toString());
        expect(newQuizQuestionResult.question.toString()).toBe(questionId.toString());
        expect(newQuizQuestionResult.selectedAnswer).toBe(selectedAnswer);
        expect(newQuizQuestionResult.isCorrect).toBe(isCorrect);
        expect(newQuizQuestionResult.elapsedTimeInMs).toBe(0);
    } catch (error) {
        console.log(error);
        return Promise.reject(error);
    }
});
