import { Schema, model, HydratedDocument, ObjectId } from 'mongoose';
import { PopulatedQuizAttemptType, QuizAttemptType } from './QuizAttempt';

export interface IQuizHistory {
    attempt: ObjectId;
};

export type QuizHistoryType = HydratedDocument<IQuizHistory> &
{
    createdAt?: Date;
    updatedAt?: Date
};

export type PopulatedQuizHistoryType = QuizHistoryType &
{ attempt: QuizAttemptType | PopulatedQuizAttemptType };

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
