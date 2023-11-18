import { afterAll, beforeAll, expect, test } from '@jest/globals';
import { dbConnection, dbClose } from '../../../db/connection';

import mongoose from 'mongoose';
import { QuizHistory } from '../../../db/models';
import type { QuizHistoryType } from '../../../db/types';

beforeAll(async () => {
    await dbConnection(process.env.TEST_DB_NAME);
});

afterAll(async () => {
    await QuizHistory.deleteMany({});
    await dbClose();
});

test('QuizHistoryModel', async () => {
    const quizAttemptId = new mongoose.Types.ObjectId();

    const newQuizHistory: QuizHistoryType = await QuizHistory
        .create({ attempt: quizAttemptId })
        .then(data => data);

    expect(newQuizHistory).toBeDefined();
    expect(newQuizHistory.attempt).toBe(quizAttemptId);
});
