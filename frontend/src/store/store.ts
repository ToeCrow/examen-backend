// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import notificationReducer from '../features/notificatons/notificationSlice';
import notesReducer from '../features/notes/noteSlice';

const store = configureStore({
  reducer: {
    notification: notificationReducer,
    notes: notesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
