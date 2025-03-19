import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  notifications: Notification[];
  isLoading: boolean;
  darkMode: boolean;
  sidebarOpen: boolean;
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  autoClose?: boolean;
  duration?: number;
}

const initialState: UIState = {
  notifications: [],
  isLoading: false,
  darkMode: false,
  sidebarOpen: true
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id'>>) => {
      const id = Date.now().toString();
      state.notifications.push({
        id,
        ...action.payload
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    }
  }
});

export const {
  addNotification,
  removeNotification,
  clearNotifications,
  setLoading,
  toggleDarkMode,
  toggleSidebar
} = uiSlice.actions;

export default uiSlice.reducer;
