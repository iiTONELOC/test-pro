import { Router } from 'express';
import { topicRouteController } from '../../controllers';

const router = Router();

// api/topics
router.route('/')
    // GET all topics
    .get(topicRouteController.getAllTopics)
    // CREATE a topic
    .post(topicRouteController.createTopic);

// api/topics/:id
router.route('/:id')
    // GET a topic by id
    .get(topicRouteController.getTopicById)
    // UPDATE a topic by id
    .put(topicRouteController.updateTopicById)
    // DELETE a topic by id
    .delete(topicRouteController.deleteTopicById);

export default router;
