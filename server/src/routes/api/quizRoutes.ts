import { Router } from 'express';
import { quizRouteController } from '../../controllers';

const router = Router();

// api/quizzes
router.route('/')
    // GET all quizzes
    .get(quizRouteController.getAllQuizzes)
    // CREATE a quiz
    .post(quizRouteController.createQuiz);

// api/quizzes/:id
router.route('/:id')
    // GET a quiz by id
    .get(quizRouteController.getQuizById)
    // UPDATE a quiz by id
    .put(quizRouteController.updateQuizById)
    // DELETE a quiz by id
    .delete(quizRouteController.deleteQuizById);

export default router;
