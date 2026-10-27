import { Router } from 'express';
import publicRoutes from './public.js';
import adminRoutes from './admin.js';

const router = Router();

router.use('/', publicRoutes);
router.use('/admin', adminRoutes);

export default router;
