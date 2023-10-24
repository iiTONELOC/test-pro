import { Router } from 'express';
import { questionRouteController } from '../../controllers';

const router = Router();

// api/questions
router.route('/')
    // GET all questions
    .get(questionRouteController.getAll)
    // CREATE a question
    .post(questionRouteController.create);

// api/questions/:id
router.route('/:id')
    // GET a question by id
    .get(questionRouteController.getById)
    // UPDATE a question by id
    .put(questionRouteController.updateById)
    // DELETE a question by id
    .delete(questionRouteController.deleteById);

export default router;
