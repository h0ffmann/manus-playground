import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import browserReducer from './browserSlice';
import ec2Reducer from './ec2Slice';
import uiReducer from './uiSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    browser: browserReducer,
    ec2: ec2Reducer,
    ui: uiReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
