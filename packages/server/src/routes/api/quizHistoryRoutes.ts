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

//api/history/quiz/:quizId
router.route('/quiz/:quizId')
    // GET all quiz histories by quiz id
    .get(quizHistoryRouteController.getByQuizId);

export default router;
