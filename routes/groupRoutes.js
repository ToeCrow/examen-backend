// src/routes/groupRoutes.js

import express from 'express';
import {
  createGroup,
  addUserToGroup,
  createGroupInvite,
  promoteToAdmin,
  leaveGroup
} from '../controllers/groupController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Alla routes under groups kräver auth:
router.use(authenticateToken);

// Skapa en ny grupp (creator blir admin)
router.post('/create', createGroup);

// Lägg till user i grupp (member)
router.post('/add-user', addUserToGroup);

// Skapa invite till grupp
router.post('/invite', createGroupInvite);

// Promota en user till admin
router.post('/promote', promoteToAdmin);

// Lämna en grupp (med stöd för delete/transfer)
router.post('/leave', leaveGroup);

export default router;
