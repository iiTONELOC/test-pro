import { Schema, model, HydratedDocument, ObjectId } from 'mongoose';
import { ITopic } from './types';

export enum QuestionTypeEnums {
    MultipleChoice = 'MultipleChoice',
    TrueFalse = 'TrueFalse',
    FillInTheBlank = 'FillInTheBlank',
    ShortAnswer = 'ShortAnswer',
    Matching = 'Matching',
    Ordering = 'Ordering',
    Image = 'Image'
};

export interface IQuestion {
    questionType: QuestionTypeEnums;
    question: string;
    topics: [ObjectId],
    options: [string],
    answer: string;
    explanation: string;
    areaToReview: [string];
};

export type QuestionModelType = HydratedDocument<IQuestion> & { createdAt?: Date; updatedAt?: Date };
export type PopulatedQuestionModelType = QuestionModelType & { topics: [ITopic] };

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
