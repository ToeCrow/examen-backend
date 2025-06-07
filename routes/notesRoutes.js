import express from 'express';
import {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
  searchNotes,
  getGroupNotes // lägg till importen
} from '../controllers/notesController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Alla routes kräver auth
router.use(authenticateToken);

// CRUD för vanliga notes
router.post('/', createNote);
router.get('/', getNotes);
router.get('/:id', getNoteById);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

// Sök notes
router.get('/search/query', searchNotes);

// 🆕 Hämta notes för en grupp
router.get('/group/:groupId', getGroupNotes);

export default router;
