import { Router } from 'express';
import { topicRouteController } from '../../controllers';

const router = Router();

// api/topics
router.route('/')
    // GET all topics
    .get(topicRouteController.getAll)
    // CREATE a topic
    .post(topicRouteController.create);

// api/topics/:id
router.route('/:id')
    // GET a topic by id
    .get(topicRouteController.getById)
    // UPDATE a topic by id
    .put(topicRouteController.updateById)
    // DELETE a topic by id
    .delete(topicRouteController.deleteById);

export default router;
