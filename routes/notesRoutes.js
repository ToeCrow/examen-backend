import express from 'express';
import {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
  searchNotes,
  getGroupNotes
} from '../controllers/notesController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes requires auth
router.use(authenticateToken);

// Specific routes  
router.get('/search', searchNotes);
router.get('/group/:groupId', getGroupNotes);

// CRUD for notes
router.post('/', createNote);
router.get('/', getNotes);
router.get('/:id', getNoteById);      // Sista GET-routen med :id
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

export default router;
