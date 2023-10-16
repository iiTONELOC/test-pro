import { Schema, model, HydratedDocument } from 'mongoose';
import { QuizQuestionResultType } from './QuizQuestionResult';

export interface IQuizAttempt {
    quizId: string;
    questions: [QuizQuestionResultType]
    earnedPoints: number;
    passingPoints: number;
    passed: boolean;
    dateTaken: Date;
    elapsedTimeInMs: number;
};

export type QuizAttemptType = HydratedDocument<IQuizAttempt> &
{ createdAt?: Date; updatedAt?: Date };

export type PopulatedQuizAttemptType = QuizAttemptType & { questions: QuizQuestionResultType[] };

const QuizAttemptSchema = new Schema({
    quizId: {
        type: Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true
    },
    questions: [{
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
