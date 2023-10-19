import { Schema, model, ObjectId, HydratedDocument } from 'mongoose';
import { IQuestion, ITopic, PopulatedQuestionModelType } from './types';

export interface IQuiz {
    name: string;
    topics: [ObjectId];
    questions: [ObjectId];
};

export type QuizModelType = HydratedDocument<IQuiz> & { createdAt?: Date; updatedAt?: Date };
export type PopulatedQuizModel = QuizModelType & { topics: [ITopic], questions: [PopulatedQuestionModelType] };


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
