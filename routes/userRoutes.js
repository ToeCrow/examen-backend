import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { 
  signup, 
  login,
  getMe,
  refreshAccessToken
} from '../controllers/userController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/refresh-token', refreshAccessToken);
router.get('/me', authenticateToken, getMe);

export default router;
