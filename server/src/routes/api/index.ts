import { Router } from 'express';
import quizRoutes from './quizRoutes';
import topicRoutes from './topicRoutes';
import questionRoutes from './questionRoutes';
import quizAttemptRoutes from './quizAttemptRoutes';

const router = Router();

router.use('/quizzes', quizRoutes);
router.use('/quiz-attempts', quizAttemptRoutes);

router.use('/topics', topicRoutes);
router.use('/questions', questionRoutes);

export default router;
