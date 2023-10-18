import { Router } from 'express';
import topicRoutes from './topicRoutes';

const router = Router();

router.use('/topics', topicRoutes);

export default router;
