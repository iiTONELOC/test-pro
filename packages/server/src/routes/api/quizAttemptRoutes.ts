import { Router } from 'express';
import { quizAttemptRouteController } from '../../controllers';

const router = Router();

// api/quiz-attempts
router.get('/', quizAttemptRouteController.getAll);
router.post('/', quizAttemptRouteController.create);

// api/quiz-attempts/:attemptId
router.get('/:id', quizAttemptRouteController.getById);
router.put('/:id', quizAttemptRouteController.updateById);
router.delete('/:id', quizAttemptRouteController.deleteById);

// api/quiz-attempts/:attemptId/answeredQuestions
router.post('/:id/answered-questions', quizAttemptRouteController.addAnsweredQuestion);

// api/quiz-attempts/:attemptId/grade-quiz
router.get('/:id/grade-quiz', quizAttemptRouteController.gradeQuizAttempt);

// api/quiz-attempts/for-quiz/:quizId
router.get('/for-quiz/:quizId', quizAttemptRouteController.getByQuizId);

export default router
