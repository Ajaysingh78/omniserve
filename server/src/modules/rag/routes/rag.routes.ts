import { Router } from 'express';
import { verifyToken, authorizeRole } from '../../../middlewares/auth.middleware.js';
import { RagController } from '../controllers/rag.controller.js';
import { UserRole } from '../../../models/enums.js';

const router = Router();

// Secure chat route accessible to all authenticated roles
router.post('/chat', verifyToken, RagController.handleChat);

// Chat Sessions Lifecycle Routes
router.get('/chats', verifyToken, RagController.listSessions);
router.post('/chats', verifyToken, RagController.createSession);
router.get('/chats/:id', verifyToken, RagController.getSession);
router.delete('/chats/:id', verifyToken, RagController.deleteSession);

// Sync trigger route restricted strictly to admins
router.post(
  '/sync',
  verifyToken,
  authorizeRole(UserRole.SYSTEM_ADMIN, UserRole.SUPER_ADMIN),
  RagController.handleSync
);

export default router;
