import { Schema, model, HydratedDocument, Types } from 'mongoose';
import { QuestionModelType, PopulatedQuestionModelType } from './types';

/**
 * ```ts
 * interface IQuizQuestionResult {
 *    quizAttempt: Types.ObjectId;
 *    question: Types.ObjectId;
 *    selectedAnswer: string;
 *    isCorrect: boolean;
 * };
 * ```
 */
export interface IQuizQuestionResult {
    quizAttempt: Types.ObjectId;
    question: Types.ObjectId;
    selectedAnswer: string;
    isCorrect: boolean;
    elapsedTimeInMs: number;
};

/**
 * ```ts
 * type QuizQuestionResultType = {
 *    _id: Types.ObjectId;
 *    quizAttempt: Types.ObjectId;
 *    question: Types.ObjectId;
 *    selectedAnswer: string;
 *    isCorrect: boolean;
 *    elapsedTimeInMs: number;
 *    createdAt?: Date;
 *    updatedAt?: Date;
 *    __v?: number;
 * }
 * ```
 */
export type QuizQuestionResultType = HydratedDocument<IQuizQuestionResult> &
{ createdAt?: Date; updatedAt?: Date };


/**
 * ```ts
 * type PopulatedQuizQuestionResultType = {
 *    _id: Types.ObjectId;
 *    quizAttempt: Types.ObjectId;
 *    question: {
 *      _id: Types.ObjectId;
 *      questionType: QuestionTypeEnums;
 *      question: string;
 *      topics: [
 *          {
 *              _id: Types.ObjectId;
 *              name: string;
 *              createdAt?: Date;
 *              updatedAt?: Date;
 *          }
 *      ];
 *      options: string[];
 *      answer: string;
 *      explanation: string;
 *      areaToReview: string;
 *      createdAt?: Date;
 *      updatedAt?: Date;
 *      __v?: number;
 *    };
 *    selectedAnswer: string;
 *    isCorrect: boolean;
 *    elapsedTimeInMs: number;
 *    createdAt?: Date;
 *    updatedAt?: Date;
 *    __v?: number;
 * };
 * ```
 */
export type PopulatedQuizQuestionResultType = QuizQuestionResultType &
{
    quizAttempt: Types.ObjectId;
    question: PopulatedQuestionModelType;
};

const QuizQuestionResultSchema = new Schema({
    quizAttempt: {
        type: Schema.Types.ObjectId,
        required: true
    },
    question: {
        type: Schema.Types.ObjectId,
        ref: 'Question',
        required: true
    },
    selectedAnswer: {
        type: String,
        required: true
    },
    isCorrect: {
        type: Boolean,
        required: true
    },
    elapsedTimeInMs: {
        type: Number,
        required: true
    }
}, {
    id: false,
    timestamps: true
});

export default model<QuizQuestionResultType>('QuizQuestionResult', QuizQuestionResultSchema);
