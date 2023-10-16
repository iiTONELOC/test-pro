import { Schema, model, HydratedDocument, ObjectId } from 'mongoose';
import { QuizModelType, PopulatedQuizModel, QuestionModelType, PopulatedQuestionModelType } from './types';

export interface IQuizQuestionResult {
    quiz: ObjectId;
    question: ObjectId;
    selectedAnswer: string;
    isCorrect: boolean;
};

export type QuizQuestionResultType = HydratedDocument<IQuizQuestionResult> &
{ createdAt?: Date; updatedAt?: Date };

export type PopulatedQuizQuestionResultType = QuizQuestionResultType &
{
    quiz: QuizModelType | PopulatedQuizModel;
    question: QuestionModelType | PopulatedQuestionModelType
};

const QuizQuestionResultSchema = new Schema({
    quiz: {
        type: Schema.Types.ObjectId,
        ref: 'Quiz',
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
    }
}, {
    id: false,
    timestamps: true
});

export default model<QuizQuestionResultType>('QuizQuestionResult', QuizQuestionResultSchema);
