import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  userEmail: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  userEmail: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<string>) {
      state.isAuthenticated = true;
      state.userEmail = action.payload;
    },
    register(state, action: PayloadAction<string>) {
      state.isAuthenticated = true;
      state.userEmail = action.payload;
    },
  },
});

export const { login, register } = authSlice.actions;
export default authSlice.reducer;
