import { Router } from 'express';
import apiRoutes from './api';

const router = Router();

router.use('/api', apiRoutes);

// create a basic error route
router.use('*', (req, res) => {
    res.status(404).send('Not Found');
});

export default router;
