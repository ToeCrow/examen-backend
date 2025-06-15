// src/features/notes/notesSlice.ts
import { createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { fetchNotes, createNote, updateNote, deleteNote, searchNotes  } from '../../utils/api';

export interface Note {
  id: string;
  title: string;
  text: string;
  created_at: string;
  modified_at: string | null;
}

interface NotesState {
  notes: Note[];
  loading: boolean;
  error: string | null;
}

const initialState: NotesState = {
  notes: [],
  loading: false,
  error: null,
};

export const fetchAllNotes = createAsyncThunk('notes/fetchAll', fetchNotes);
export const createNewNote = createAsyncThunk(
  'notes/create',
  async ({ title, text }: { title: string; text: string }) => createNote(title, text)
);
export const updateExistingNote = createAsyncThunk(
  'notes/update',
  async ({ id, title, text }: { id: string; title: string; text: string }) =>
    updateNote(id, title, text)
);
export const deleteExistingNote = createAsyncThunk('notes/delete', async (id: string) => {
  await deleteNote(id);
  return id;
});

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchAllNotes.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllNotes.fulfilled, (state, action: PayloadAction<Note[]>) => {
        state.notes = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllNotes.rejected, state => {
        state.error = 'Kunde inte hämta anteckningar';
        state.loading = false;
      })
      .addCase(createNewNote.fulfilled, (state, action) => {
        state.notes.unshift(action.payload);
      })
      .addCase(updateExistingNote.fulfilled, (state, action) => {
        const idx = state.notes.findIndex(n => n.id === action.payload.id);
        if (idx !== -1) {
          state.notes[idx] = action.payload;
        }
      })
      .addCase(deleteExistingNote.fulfilled, (state, action) => {
        state.notes = state.notes.filter(n => n.id !== action.payload);
      });
  },
});

export default notesSlice.reducer;
