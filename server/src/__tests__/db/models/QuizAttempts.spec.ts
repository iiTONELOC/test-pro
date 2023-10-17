import { afterAll, beforeAll, expect, test } from 'bun:test';
import { dbConnection, dbClose } from '../../../db/connection';

import mongoose from 'mongoose';
import { QuizAttempt } from '../../../db/models';
import type { QuizAttemptType } from '../../../db/types';

beforeAll(async () => {
    await dbConnection(process.env.TEST_DB_NAME);
});

afterAll(async () => {
    await QuizAttempt.deleteMany({});
    await dbClose();
});

test('QuizAttemptModel', async () => {
    try {
        //create ids
        const quizId = new mongoose.Types.ObjectId();
        const questions = [new mongoose.Types.ObjectId()];
        const earnedPoints = 1;
        const passingPoints = 1;
        const passed = true;
        const dateTaken = new Date();
        const elapsedTimeInMs = 15000;

        const newQuizAttempt: QuizAttemptType = await QuizAttempt.create({
            quizId,
            questions,
            earnedPoints,
            passingPoints,
            passed,
            dateTaken,
            elapsedTimeInMs
        }).then(data => data);

        expect(newQuizAttempt).toBeDefined();
        expect(newQuizAttempt.quizId).toBe(quizId);
        expect(newQuizAttempt.questions[0]).toBe(questions[0]);
        expect(newQuizAttempt.earnedPoints).toBe(earnedPoints);
        expect(newQuizAttempt.passingPoints).toBe(passingPoints);
        expect(newQuizAttempt.passed).toBe(passed);
        expect(newQuizAttempt.dateTaken).toBe(dateTaken);
        expect(newQuizAttempt.elapsedTimeInMs).toBe(elapsedTimeInMs);

    } catch (error) {
        console.log(error);
        return Promise.reject(error);
    }
});
