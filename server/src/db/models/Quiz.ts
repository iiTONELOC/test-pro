import { Schema, model, HydratedDocument, Types } from 'mongoose';
import { PopulatedQuestionModelType, TopicModelType } from './types';

/**
 * ```ts
 * interface IQuiz {
 *   name: string;
 *   topics: [Types.ObjectId];
 *   questions: [Types.ObjectId];
 * }
 * ```
 */
export interface IQuiz {
    name: string;
    topics: Types.ObjectId[];
    questions: Types.ObjectId[];
};

/**
 * ```ts
 * type QuizModelType = {
 *  _id: Types.ObjectId;
 *  name: string;
 *  topics: [Types.ObjectId];
 *  questions: [Types.ObjectId];
 *  createdAt?: Date;
 *  updatedAt?: Date;
 *  __v?: number;
 * }
 * ```
 */
export type QuizModelType = HydratedDocument<IQuiz> & { createdAt?: Date; updatedAt?: Date };

/**
 * ```ts
 * type PopulatedQuizModel = {
 *  _id: Types.ObjectId;
 *  name: string;
 *  topics: [{
 *      _id: Types.ObjectId,
 *       name: string,
 *       createdAt?: Date,
 *       updatedAt?: Date,
 *       __v?: number
 *  }}];
 *  questions: [{
 *      _id: Types.ObjectId,
 *      questionType: QuestionTypeEnums,
 *      question: string,
 *      topics:[{
 *       _id: Types.ObjectId,
 *         name: string,
 *         createdAt?: Date,
 *         updatedAt?: Date,
 *          __v?: number
 *      }];
 *  createdAt?: Date;
 *  updatedAt?: Date;
 *  __v?: number;
 * }
 * ```
 */
export type PopulatedQuizModel = QuizModelType & { topics: [TopicModelType], questions: [PopulatedQuestionModelType] };


const QuizSchema = new Schema({
    name: {
        type: String,
        required: true,
        maxLength: 250,
        trim: true
    },
    topics: [{
        type: Schema.Types.ObjectId,
        ref: 'Topic',
        required: true
    }],
    questions: [{
        type: Schema.Types.ObjectId,
        ref: 'Question',
        required: true
    }]
}, {
    id: false,
    timestamps: true
});

export default model<QuizModelType>('Quiz', QuizSchema);
