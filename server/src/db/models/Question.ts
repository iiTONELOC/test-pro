import { Schema, model, HydratedDocument, Types } from 'mongoose';
import { TopicModelType } from './types';



/**
 * ```ts
 *  enum QuestionTypeEnums {
 *     MultipleChoice = 'MultipleChoice',
 *     TrueFalse = 'TrueFalse',
 *     FillInTheBlank = 'FillInTheBlank',
 *     ShortAnswer = 'ShortAnswer',
 *     Matching = 'Matching',
 *     Ordering = 'Ordering',
 *     Image = 'Image'
 *  }
 * ```
 */
export enum QuestionTypeEnums {
    MultipleChoice = 'MultipleChoice',
    TrueFalse = 'TrueFalse',
    FillInTheBlank = 'FillInTheBlank',
    ShortAnswer = 'ShortAnswer',
    Matching = 'Matching',
    Ordering = 'Ordering',
    Image = 'Image'
};

/**
 * ```ts
 * interface IQuestion {
 *    questionType: QuestionTypeEnums;
 *    question: string;
 *    topics: ObjectId[],
 *    options: string[],
 *    answer: string;
 *    explanation: string;
 *    areaToReview: string[];
 *    explanation: string;
 *    areaToReview: string[];
 * }
 * ```
 */
export interface IQuestion {
    questionType: QuestionTypeEnums;
    question: string;
    topics: Types.ObjectId[],
    options: string[],
    answer: string;
    explanation: string;
    areaToReview: string[];
};

/***
 * ```ts
 *  type QuestionModelType = {
 *    _id: ObjectId;
 *    questionType: QuestionTypeEnums;
 *    question: string;
 *    topics: ObjectId[],
 *    options: string[],
 *    answer: string;
 *    explanation: string;
 *    areaToReview: string[];
 *    explanation: string;
 *    areaToReview: string[];
 *    createdAt?: Date;
 *    updatedAt?: Date;
 * }
 * ```
 */
export type QuestionModelType = HydratedDocument<IQuestion> & { createdAt?: Date; updatedAt?: Date };

/***
 * ```ts
 *  type QuestionModelType = {
 *    _id: ObjectId;
 *    questionType: QuestionTypeEnums;
 *    question: string;
 *    topics: [
 *        {
 *           _id: ObjectId;
 *           name: string;
 *           createdAt?: Date;
 *           updatedAt?: Date;
 *       }
 *    ],
 *    options: string[],
 *    answer: string;
 *    explanation: string;
 *    areaToReview: string[];
 *    explanation: string;
 *    areaToReview: string[];
 *    createdAt?: Date;
 *    updatedAt?: Date;
 * }
 * ```
 */
export type PopulatedQuestionModelType = QuestionModelType & { topics: TopicModelType[] };

const QuestionSchema = new Schema({
    questionType: {
        type: String,
        required: true,
        enum: Object.values(QuestionTypeEnums)
    },
    question: {
        type: String,
        required: true,
        maxLength: 5000,
        trim: true
    },
    topics: [{
        type: Schema.Types.ObjectId,
        ref: 'Topic'
    }],
    options: [{
        type: String,
        required: true,
        maxLength: 2000,
        trim: true
    }],
    answer: {
        type: String,
        required: true,
        maxLength: 2000,
        trim: true
    },
    explanation: {
        type: String,
        required: true,
        maxLength: 2000,
        trim: true
    },
    areaToReview: [{
        type: String,
        required: true,
        maxLength: 250,
        trim: true
    }]
}, {
    id: false,
    timestamps: true
});

export default model<QuestionModelType>('Question', QuestionSchema);
