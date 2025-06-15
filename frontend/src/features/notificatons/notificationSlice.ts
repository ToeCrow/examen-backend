import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface NotificationState {
  logoutMessage: string | null;
}

const initialState: NotificationState = {
  logoutMessage: null,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setLogoutMessage(state, action: PayloadAction<string>) {
      state.logoutMessage = action.payload;
    },
    clearLogoutMessage(state) {
      state.logoutMessage = null;
    },
  },
});

export const { setLogoutMessage, clearLogoutMessage } = notificationSlice.actions;
export default notificationSlice.reducer;
