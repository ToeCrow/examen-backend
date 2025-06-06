import express from 'express';
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  searchNotes
} from '../controllers/notesController.js';

import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken); // Alla routes nedan kräver token

router.get('/', getNotes);
router.post('/', createNote);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);
router.get('/search', searchNotes); 

export default router;
