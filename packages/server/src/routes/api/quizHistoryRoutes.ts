import { Router } from 'express';
import { quizHistoryRouteController } from '../../controllers';

const router = Router();

//api/history
router.route('/')
    // GET all quiz histories
    .get(quizHistoryRouteController.getAll)
    // CREATE a quiz history
    .post(quizHistoryRouteController.create);

//api/history/:id
router.route('/:id')
    // GET a quiz history by id
    .get(quizHistoryRouteController.getById)
    // DELETE a quiz history by id
    .delete(quizHistoryRouteController.deleteById);

export default router;
