import { Router } from 'express';
import * as systemsController from '../controllers/systems.controller.js';
import * as settingsController from '../controllers/settings.controller.js';

const router = Router();

router.get('/systems', systemsController.listPublic);
router.get('/systems/:slug', systemsController.showPublic);
router.get('/settings', settingsController.getPublic);

export default router;
