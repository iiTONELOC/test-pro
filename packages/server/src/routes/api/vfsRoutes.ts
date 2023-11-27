import { Router } from 'express';
import { vfsRouteController } from '../../controllers';

const router = Router();

router.get('/', vfsRouteController.get);
router.put('/', vfsRouteController.update);
router.delete('/', vfsRouteController.delete);

export default router;
