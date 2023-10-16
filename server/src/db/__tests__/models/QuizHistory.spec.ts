import { afterAll, beforeAll, expect, test } from 'bun:test';
import { dbConnection, dbClose } from '../../connection';

import mongoose from 'mongoose';
import { QuizHistory } from '../../models';
import type { QuizHistoryType } from '../../types';

beforeAll(async () => {
    await dbConnection(process.env.TEST_DB_NAME);
    return Promise.resolve();
});

afterAll(async () => {
    await QuizHistory.deleteMany({});
    await dbClose();
    return Promise.resolve();
});

test('QuizHistoryModel', async () => {
    const quizAttemptId = new mongoose.Types.ObjectId();

    const newQuizHistory: QuizHistoryType = await QuizHistory
        .create({ attempt: quizAttemptId })
        .then(data => data);

    expect(newQuizHistory).toBeDefined();
    expect(newQuizHistory.attempt).toBe(quizAttemptId);

    return Promise.resolve();
});
