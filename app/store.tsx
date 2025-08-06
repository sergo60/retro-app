import { configureStore } from '@reduxjs/toolkit';
import authSlice from './features/auth/authSlice';
import retroDetailsSlice from './features/retros/retroDetailsSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    retroDetails: retroDetailsSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
