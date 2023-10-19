import { Router } from 'express';
import topicRoutes from './topicRoutes';
import questionRoutes from './questionRoutes';

const router = Router();

router.use('/topics', topicRoutes);
router.use('/questions', questionRoutes);

export default router;
