// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import notificationReducer from '../features/notificatons/notificationSlice';
import notesReducer from '../features/notes/noteSlice';
import columnsReducer from '../features/columns/columnsSlice';

const store = configureStore({
  reducer: {
    notification: notificationReducer,
    notes: notesReducer,
    columns: columnsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
