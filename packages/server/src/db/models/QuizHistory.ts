import { Schema, model, HydratedDocument, Types } from 'mongoose';
import { PopulatedQuizAttemptType } from './QuizAttempt';

/**
 * ```ts
 * interface IQuizHistory {
 *    attempt: Types.ObjectId;
 * };
 * ```
 */
export interface IQuizHistory {
    attempt: Types.ObjectId;
};

/**
 * ```ts
 * type QuizHistoryType = {
 *    attempt: Types.ObjectId;
 *    createdAt?: Date;
 *    updatedAt?: Date
 *    __v?: number;
 * };
 * ```
 */
export type QuizHistoryType = HydratedDocument<IQuizHistory> &
{
    createdAt?: Date;
    updatedAt?: Date
};

/**
 * ```ts
 *  type PopulatedQuizHistoryType =  {
 *    attempt: {
 *      _id: Types.ObjectId;
 *      quizId: Types.ObjectId;
 *      answeredQuestions: [{
 *          _id: Types.ObjectId;
 *          quizAttempt: Types.ObjectId;
 *          question: {
 *             _id: Types.ObjectId;
 *             questionType: QuestionTypeEnums;
 *             question: string;
 *             topics: [
 *                {
 *                      _id: Types.ObjectId;
 *                      name: string;
 *                      createdAt?: Date;
 *                      updatedAt?: Date;
 *                      __v?: number;
 *                }
 *             ];
 *          options: string[];
 *          answer: string;
 *          explanation: string;
 *          areaToReview: string[];
 *          createdAt?: Date;
 *          updatedAt?: Date;
 *          __v?: number;
 *         }
 *      }];
 *     earnedPoints: number;
 *     passingPoints: number;
 *     passed: boolean;
 *     dateTaken: Date;
 *     elapsedTimeInMs: number;
 *     createdAt?: Date;
 *     updatedAt?: Date;
 *     __v?: number;
 *    }
 *    createdAt?: Date;
 *    updatedAt?: Date
 *    __v?: number;
 * };
 * ```
 */
export type PopulatedQuizHistoryType = QuizHistoryType & { attempt: PopulatedQuizAttemptType };

const QuizHistorySchema = new Schema({
    attempt: {
        type: Schema.Types.ObjectId,
        ref: 'QuizAttempt',
        required: true
    }
}, {
    id: false,
    timestamps: true
});

export default model<QuizHistoryType>('QuizHistory', QuizHistorySchema);
