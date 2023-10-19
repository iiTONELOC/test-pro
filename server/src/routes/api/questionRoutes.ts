import { Router } from 'express';
import { questionRouteController } from '../../controllers';

const router = Router();

// api/questions
router.route('/')
    // GET all questions
    .get(questionRouteController.getAllQuestions)
    // CREATE a question
    .post(questionRouteController.createQuestion);

// api/questions/:id
router.route('/:id')
    // GET a question by id
    .get(questionRouteController.getQuestionById)
    // UPDATE a question by id
    .put(questionRouteController.updateQuestionById)
    // DELETE a question by id
    .delete(questionRouteController.deleteQuestionById);

export default router;
