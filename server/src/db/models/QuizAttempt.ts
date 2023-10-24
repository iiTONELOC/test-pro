import { Schema, model, HydratedDocument, Types } from 'mongoose';
import { QuizQuestionResultType } from './QuizQuestionResult';

/**
 * ```ts
 * interface IQuizAttempt {
 *   quizId: Types.ObjectId;
 *   answeredQuestions: Types.ObjectId[];
 *   earnedPoints: number;
 *   passingPoints: number;
 *   passed: boolean;
 *   dateTaken: Date;
 *   elapsedTimeInMs: number;
 *  }
 * ```
 */

export interface IQuizAttempt {
    quizId: Types.ObjectId;
    answeredQuestions: QuizQuestionResultType[]
    earnedPoints: number;
    passingPoints: number;
    passed: boolean;
    dateTaken: Date;
    elapsedTimeInMs: number;
};

/**
 * ```ts
 * type QuizAttemptType = {
 *   quizId: Types.ObjectId;
 *   answeredQuestions: Types.ObjectId[];
 *   earnedPoints: number;
 *   passingPoints: number;
 *   passed: boolean;
 *   dateTaken: Date;
 *   elapsedTimeInMs: number;
 *  }
 * ```
 */

export type QuizAttemptType = HydratedDocument<IQuizAttempt> &
{ createdAt?: Date; updatedAt?: Date };

/**
 * ```ts
 * type PopulatedQuizAttemptType = {
 *   quizId: Types.ObjectId;
 *   answeredQuestions: [{
 *      _id: Types.ObjectId;
 *      quizAttempt: Types.ObjectId;
 *      question: {
 *          _id: Types.ObjectId;
 *          questionType: QuestionTypeEnums;
 *          question: string;
 *          topics: [
 *              {
 *                  _id: Types.ObjectId;
 *                  name: string;
 *                  createdAt?: Date;
 *                  updatedAt?: Date;
 *                  __v?: number;
 *              }
 *          ];
 *          options: string[];
 *          answer: string;
 *          explanation: string;
 *          areaToReview: string;
 *          createdAt?: Date;
 *          updatedAt?: Date;
 *          __v?: number;
 *      };
 *      selectedAnswer: string;
 *      isCorrect: boolean;
 *      createdAt?: Date;
 *      updatedAt?: Date;
 *      __v?: number;
 *   }];
 *  earnedPoints: number;
 *  passingPoints: number;
 *  passed: boolean;
 *  dateTaken: Date;
 *  elapsedTimeInMs: number;
 *  createdAt?: Date;
 *  updatedAt?: Date;
 *  __v?: number;
 *  }
 * ```
 */
export type PopulatedQuizAttemptType = QuizAttemptType & { answeredQuestions: QuizQuestionResultType[] };

const QuizAttemptSchema = new Schema({
    quizId: {
        type: Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true
    },
    answeredQuestions: [{
        type: Schema.Types.ObjectId,
        ref: 'QuizQuestionResult',
        required: true
    }],
    earnedPoints: {
        type: Number,
        required: true
    },
    passingPoints: {
        type: Number,
        required: true
    },
    passed: {
        type: Boolean,
        required: true
    },
    dateTaken: {
        type: Date,
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

export default model<QuizAttemptType>('QuizAttempt', QuizAttemptSchema);
