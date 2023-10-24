import { Router } from 'express';
import { quizRouteController } from '../../controllers';

const router = Router();

// api/quizzes
router.route('/')
    // GET all quizzes
    .get(quizRouteController.getAll)
    // CREATE a quiz
    .post(quizRouteController.create);

// api/quizzes/:id
router.route('/:id')
    // GET a quiz by id
    .get(quizRouteController.getById)
    // UPDATE a quiz by id
    .put(quizRouteController.updateById)
    // DELETE a quiz by id
    .delete(quizRouteController.deleteById);

export default router;
