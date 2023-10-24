import { Topic } from '../../db/models';
import { createSelectTerms } from './controllerUtils';
import type { TopicModelType } from '../../db/models/types';



/**
 * Topic Controller
 * @description Interface declaring the methods available for the Topic Controller:
 *
 * ```typescript
 *   interface ITopicController {
 *      getAll: (showTimestamps?: boolean) => Promise<TopicModelType[]>;
 *
 *      getById: (id: string, showTimestamps?: boolean) => Promise<TopicModelType | null>;
 *
 *      create: (topic: string) => Promise<TopicModelType>;
 *
 *      updateById: (id: string, topic: string, showTimestamps?: boolean) => Promise<TopicModelType | null>;
 *
 *      deleteById: (id: string) => Promise<TopicModelType | null>;
 *   }
 * ```
 */
export interface ITopicController {
    /**
     * Get all topics
     * @param showTimestamps - Optional, whether to show timestamps defaults to false
     * @returns Promise<TopicModelType[]>
     */
    getAll: (showTimestamps?: boolean) => Promise<TopicModelType[]>;
    /**
     * Get topic by id
     * @param id - The id of the topic to get
     * @param showTimestamps - Optional, whether to show timestamps defaults to false
     * @returns Promise<TopicModelType | null>
     * 
     */
    getById: (id: string, showTimestamps?: boolean) => Promise<TopicModelType | null>;
    /**
     * Create a topic with the given name, must be unique
     * @param topic - The topic to create
     * @returns Promise<TopicModelType>
     */
    create: (topic: string) => Promise<TopicModelType>;
    /**
     * Update a topic by id
     * Allows a Topic to be renamed if the new name is unique
     * @param id - The id of the topic to update
     * @param topic - The new name of the topic
     * @param showTimestamps - Optional, whether to show timestamps defaults to false
     */
    updateById: (id: string, topic: string, showTimestamps?: boolean) => Promise<TopicModelType | null>;

    /**
     * Delete a topic by id
     * @param id - The id of the topic to delete
     * @returns Promise<TopicModelType | null>
     */
    deleteById: (id: string) => Promise<TopicModelType | null>;
}

// Get all topics
export const getAll = async (showTimestamps = false): Promise<TopicModelType[]> => {
    const selectTerms = createSelectTerms(showTimestamps);
    return await Topic.find({}).select(selectTerms) as TopicModelType[];
};

// Get topic by id
export const getById = async (id: string, showTimestamps = false): Promise<TopicModelType | null> => {
    const selectTerms = createSelectTerms(showTimestamps);
    return await Topic.findById({ _id: id }).select(selectTerms) as TopicModelType | null;
};

// create topic
export const create = async (topic: string): Promise<TopicModelType> =>
    await Topic.create({ name: topic });

// update topic by id
export const updateById = async (id: string, topic: string, showTimestamps = false): Promise<TopicModelType | null> => {
    const selectTerms = createSelectTerms(showTimestamps);
    return await Topic.findByIdAndUpdate({ _id: id }, { name: topic },
        { new: true, runValidators: true }).select(selectTerms) as TopicModelType | null;
};

// delete topic by id
export const deleteById = async (id: string): Promise<TopicModelType | null> => {
    // need to see if there are any questions or quizzes that use this topic
    // if so, then we need to remove the topic from those questions and quizzes
    // then we can delete the topic
    const deleteTopic = async (id: string): Promise<TopicModelType | null> => await Topic.findByIdAndDelete({ _id: id });

    return await deleteTopic(id);
}

export const topicController: ITopicController = {
    getAll,
    getById,
    create,
    updateById,
    deleteById
};

export default topicController;
