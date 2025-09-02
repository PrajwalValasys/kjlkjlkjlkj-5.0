import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface NotificationsState {
  notifications: any[];
  unreadCount: number;
  noticeBoard: any[];
}

const initialState: NotificationsState = {
  notifications: [],
  unreadCount: 0,
  noticeBoard: [],
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotifications: (state, action: PayloadAction<any[]>) => {
      state.notifications = action.payload;
    },
    setUnreadCount: (state, action: PayloadAction<number>) => {
      state.unreadCount = action.payload;
    },
    setNoticeBoard: (state, action: PayloadAction<any[]>) => {
      state.noticeBoard = action.payload;
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
      state.noticeBoard = [];
    },
  },
});

export const { setNotifications, setUnreadCount, setNoticeBoard, markAsRead, clearNotifications } = notificationsSlice.actions;
export default notificationsSlice.reducer;
