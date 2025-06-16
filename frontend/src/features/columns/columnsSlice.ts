import { createSlice, nanoid } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface Column {
  id: string;
  title: string;
  noteIds: string[];
}

interface ColumnsState {
  columns: Column[];
}

const initialState: ColumnsState = {
  columns: [
    { id: "today", title: "Dagens Plan", noteIds: [] },
    { id: "family", title: "Familjens Schema", noteIds: [] },
    { id: "shopping", title: "Handlelista", noteIds: [] },
  ],
};

const columnsSlice = createSlice({
  name: "columns",
  initialState,
  reducers: {
    addColumn: (state, action: PayloadAction<string>) => {
      state.columns.push({ id: nanoid(), title: action.payload, noteIds: [] });
    },
    renameColumn: (state, action: PayloadAction<{ id: string; title: string }>) => {
      const col = state.columns.find(c => c.id === action.payload.id);
      if (col) col.title = action.payload.title;
    },
    moveNote: (
      state,
      action: PayloadAction<{ noteId: string; sourceId: string; destId: string }>
    ) => {
      const source = state.columns.find(c => c.id === action.payload.sourceId);
      const dest = state.columns.find(c => c.id === action.payload.destId);
      if (source && dest) {
        source.noteIds = source.noteIds.filter(id => id !== action.payload.noteId);
        dest.noteIds.push(action.payload.noteId);
      }
    },
    addNoteToColumn: (state, action: PayloadAction<{ columnId: string; noteId: string }>) => {
      const column = state.columns.find(c => c.id === action.payload.columnId);
      if (column) column.noteIds.push(action.payload.noteId);
    },
  },
});

export const {
  addColumn,
  renameColumn,
  moveNote,
  addNoteToColumn,
} = columnsSlice.actions;

export default columnsSlice.reducer;
