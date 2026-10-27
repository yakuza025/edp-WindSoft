import { Router } from 'express';
import { requireAdminKey } from '../middleware/auth.js';
import { validateSystemBody, validateReorderBody } from '../middleware/validate.js';
import * as systemsController from '../controllers/systems.controller.js';
import * as settingsController from '../controllers/settings.controller.js';

const router = Router();

router.use(requireAdminKey);

// Systems
router.get   ('/systems',        systemsController.listAdmin);
router.post  ('/systems',        validateSystemBody, systemsController.create);
router.put   ('/systems/:id',    systemsController.update);
router.delete('/systems/:id',    systemsController.remove);
router.post  ('/systems/reorder', validateReorderBody, systemsController.reorder);

// Settings
router.put   ('/settings',       settingsController.saveAdmin);

export default router;
