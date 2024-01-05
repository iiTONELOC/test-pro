import { Schema, model, HydratedDocument, Types } from 'mongoose';
import { TopicModelType } from './types';



/**
 * ```ts
 *  enum QuestionTypeEnums {
 *     SelectAllThatApply = 'SelectAllThatApply',
 *     MultipleChoice = 'MultipleChoice',
 *     FillInTheBlank = 'FillInTheBlank',
 *     ShortAnswer = 'ShortAnswer',
 *     Matching = 'Matching',
 *     Ordering = 'Ordering',
 *     Image = 'Image'
 *  }
 * ```
 */
export enum QuestionTypeEnums {
    SelectAllThatApply = 'SelectAllThatApply',
    MultipleChoice = 'MultipleChoice',
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
 *    topics: Types.ObjectId[],
 *    options: string[],
 *    matchOptions?: string[] | null,
 *    answer: string;
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
    matchOptions?: string[] | null,
    answer: string;
    explanation: string;
    areaToReview: string[];
};

/***
 * ```ts
 *  type QuestionModelType = {
 *    _id: Types.ObjectId;
 *    questionType: QuestionTypeEnums;
 *    question: string;
 *    topics: Types.ObjectId[],
 *    options: string[],
 *    matchOptions?: string[] | null,
 *    answer: string;
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
 *    _id: Types.ObjectId;
 *    questionType: QuestionTypeEnums;
 *    question: string;
 *    topics: [
 *        {
 *           _id: Types.ObjectId;
 *           name: string;
 *           createdAt?: Date;
 *           updatedAt?: Date;
 *           __v?: number;
 *       }
 *    ],
 *    options: string[],
 *    matchOptions?: string[] | null,
 *    answer: string;
 *    explanation: string;
 *    areaToReview: string[];
 *    createdAt?: Date;
 *    updatedAt?: Date;
 *    __v?: number;
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
    matchOptions: [{
        type: String,
        maxLength: 2000,
        trim: true,
        required: false,
        default: []
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
