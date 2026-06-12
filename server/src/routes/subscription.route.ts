import express, { Router } from 'express';
import { SubscriptionController } from '../controllers/subscription.controller.js';
import { isRestaurantOwner, isSuperAdmin, verifyToken } from '../middleware/auth.middleware.js';
import { checkSubscription } from '../middleware/checkSubscription.middleware.js';

const router: Router = express.Router();

/**
 * All routes are protected and restricted to RESTAURANT_OWNER and SUPER_ADMIN
 */

router.post('/', verifyToken, isSuperAdmin, SubscriptionController.createSubscription);
router.get('/active', verifyToken, isRestaurantOwner, SubscriptionController.getActiveSubscription);
router.get('/details', verifyToken, isRestaurantOwner, checkSubscription, SubscriptionController.getSubscriptionDetails);
router.get('/', verifyToken, isSuperAdmin, SubscriptionController.getSubscriptionsByTenantId);
router.get('/:id', verifyToken, isRestaurantOwner, SubscriptionController.getSubscriptionById);
router.patch('/:id/plan', verifyToken, isRestaurantOwner, SubscriptionController.updateSubscriptionPlan);
router.patch('/:id/extend', verifyToken, isRestaurantOwner, SubscriptionController.extendSubscription);
router.delete('/:id', verifyToken, isSuperAdmin, SubscriptionController.cancelSubscription);



export default router;
