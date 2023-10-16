import { Schema, model, HydratedDocument } from 'mongoose';

export interface ITopic {
    name: string;
};

export type TopicModelType = HydratedDocument<ITopic> & { createdAt?: Date; updatedAt?: Date };

// Topics are akin to tags or categories

const TopicSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        maxLength: 150,
        trim: true
    }
}, {
    id: false,
    timestamps: true
});

export default model<TopicModelType>('Topic', TopicSchema);
