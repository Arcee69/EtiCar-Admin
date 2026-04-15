import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, AdminUser } from '../../types/global';

const initialState: AuthState = {
  token: null,
  user: null,
  role: null,
  permissions: [],
  isAuthenticated: false,
};

interface SetCredentialsPayload {
  token: string;
  user: AdminUser;
  role: string;
  permissions: string[];
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<SetCredentialsPayload>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.role = action.payload.role;
      state.permissions = action.payload.permissions;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.role = null;
      state.permissions = [];
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
