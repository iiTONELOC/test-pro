import { Schema, model, HydratedDocument } from 'mongoose';

/**
 * ```ts
 * interface ITopic {
 *    name: string;
 * }
 */
export interface ITopic {
    name: string;
};

/**
 * ```ts
 * type TopicModelType = {
 *      _id: Types.ObjectId;
 *      name: string;
 *      createdAt?: Date;
 *      updatedAt?: Date;
 *      __v?: number;
 *     }
 * ```
 */
export type TopicModelType = HydratedDocument<ITopic>
    & { createdAt?: Date; updatedAt?: Date };

// Topics are akin to tags or categories

const TopicSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        maxLength: 150,
        trim: true,
        match: /^[a-zA-Z0-9+-/)(\s]+$/i
    }
}, {
    id: false,
    timestamps: true
});

export default model<TopicModelType>('Topic', TopicSchema);
