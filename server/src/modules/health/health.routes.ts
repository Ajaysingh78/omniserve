import { Router } from 'express';
import { HealthController } from './health.controller.js';

const router = Router();

// Public health check route
router.get('/', HealthController.getPublicHealth);

export default router;
