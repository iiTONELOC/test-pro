import { Router } from 'express';
import vfsRoutes from './vfsRoutes';
import quizRoutes from './quizRoutes';
import topicRoutes from './topicRoutes';
import questionRoutes from './questionRoutes';
import quizAttemptRoutes from './quizAttemptRoutes';
import quizHistoryRoutes from './quizHistoryRoutes';

const router = Router();

router.use('/vfs', vfsRoutes)
router.use('/quizzes', quizRoutes);
router.use('/topics', topicRoutes);
router.use('/questions', questionRoutes);
router.use('/history', quizHistoryRoutes);
router.use('/quiz-attempts', quizAttemptRoutes);


export default router;
