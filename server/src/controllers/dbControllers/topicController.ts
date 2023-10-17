import { Topic, Question, Quiz } from '../../db/models';
import type { TopicModelType, PopulatedQuestionModelType, PopulatedQuizModel } from '../../db/models/types';


const createSelectTerms = (showTimeStamp: boolean) => showTimeStamp ? '-__v' : '-createdAt -updatedAt -__v';

/**
 * Topic Controller
 * @description Interface declaring the methods available for the Topic Controller:
 *
 * ```typescript
 *   interface ITopicController {
 *      getAllTopics: (showTimestamps?: boolean) => Promise<TopicModelType[]>;
 *
 *      getTopicById: (id: string, showTimestamps?: boolean) => Promise<TopicModelType | null>;
 *
 *      createTopic: (topic: string) => Promise<TopicModelType>;
 *
 *      updateTopicById: (id: string, topic: string, showTimestamps?: boolean) => Promise<TopicModelType | null>;
 *
 *      deleteTopicById: (id: string) => Promise<TopicModelType | null>;
 *   }
 * ```
 */
export interface ITopicController {
    /**
     * Get all topics
     * @param showTimestamps - Optional, whether to show timestamps defaults to false
     * @returns Promise<TopicModelType[]>
     */
    getAllTopics: (showTimestamps?: boolean) => Promise<TopicModelType[]>;
    /**
     * Get topic by id
     * @param id - The id of the topic to get
     * @param showTimestamps - Optional, whether to show timestamps defaults to false
     * @returns Promise<TopicModelType | null>
     * 
     */
    getTopicById: (id: string, showTimestamps?: boolean) => Promise<TopicModelType | null>;
    /**
     * Create a topic with the given name, must be unique
     * @param topic - The topic to create
     * @returns Promise<TopicModelType>
     */
    createTopic: (topic: string) => Promise<TopicModelType>;
    /**
     * Update a topic by id
     * Allows a Topic to be renamed if the new name is unique
     * @param id - The id of the topic to update
     * @param topic - The new name of the topic
     * @param showTimestamps - Optional, whether to show timestamps defaults to false
     */
    updateTopicById: (id: string, topic: string, showTimestamps?: boolean) => Promise<TopicModelType | null>;

    /**
     * Delete a topic by id
     * @param id - The id of the topic to delete
     * @returns Promise<TopicModelType | null>
     */
    deleteTopicById: (id: string) => Promise<TopicModelType | null>;
}

// Get all topics
export const getAllTopics = async (showTimestamps = false): Promise<TopicModelType[]> => {
    const selectTerms = createSelectTerms(showTimestamps);
    return await Topic.find({}).select(selectTerms) as TopicModelType[];
};

// Get topic by id
export const getTopicById = async (id: string, showTimestamps = false): Promise<TopicModelType | null> => {
    const selectTerms = createSelectTerms(showTimestamps);
    return await Topic.findById({ _id: id }).select(selectTerms) as TopicModelType | null;
};

// create topic
export const createTopic = async (topic: string): Promise<TopicModelType> =>
    await Topic.create({ name: topic }) as TopicModelType;

// update topic by id
export const updateTopicById = async (id: string, topic: string, showTimestamps = false): Promise<TopicModelType | null> => {
    const selectTerms = createSelectTerms(showTimestamps);
    return await Topic.findByIdAndUpdate({ _id: id }, { name: topic },
        { new: true, runValidators: true }).select(selectTerms) as TopicModelType | null;
};

// delete topic by id
export const deleteTopicById = async (id: string): Promise<TopicModelType | null> => {
    // need to see if there are any questions or quizzes that use this topic
    // if so, then we need to remove the topic from those questions and quizzes
    // then we can delete the topic
    const deleteTopic = async (id: string): Promise<TopicModelType | null> => await Topic.findByIdAndDelete({ _id: id });

    // look for questions where the topic property includes the id
    const questions: PopulatedQuestionModelType[] = await Question.find({ topics: { $in: [id] } })
        .populate({
            path: 'topics',
            select: createSelectTerms(false)
        });
    // look for quizzes where the topic property includes the id
    const quizzes: PopulatedQuizModel[] = await Quiz.find({ topics: { $in: [id] } })
        .populate({
            path: 'topics',
            select: createSelectTerms(false)
        });

    // consolidate the questions and quizzes to modify into one array
    const dataToEdit: (PopulatedQuestionModelType | PopulatedQuizModel)[] = [...questions, ...quizzes];

    if (dataToEdit.length > 0) {
        // we need to update the questions and quizzes to remove the topic
        const updateData = async (data: (PopulatedQuestionModelType | PopulatedQuizModel)[]) => {
            const promises = data.map(async (item: PopulatedQuestionModelType | PopulatedQuizModel) => {
                const topics = item.topics.filter(topic => topic.toString() !== id);
                if (item instanceof Question) {
                    return await Question.findByIdAndUpdate({ _id: item._id }, { topics });
                } else {
                    return await Quiz.findByIdAndUpdate({ _id: item._id }, { topics });
                }
            });
            return await Promise.all(promises);
        };

        await updateData(dataToEdit);
        return await deleteTopic(id);
    } else {
        return await deleteTopic(id);
    }
}

export const topicController: ITopicController = {
    getAllTopics,
    getTopicById,
    createTopic,
    updateTopicById,
    deleteTopicById
};

export default topicController;
