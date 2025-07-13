import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    users: [] // Simulated user database
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    register: (state, action) => {
      state.users.push(action.payload);
    },
    loadUsers: (state, action) => {
      state.users = action.payload;
    }
  }
});

export const { login, logout, register, loadUsers } = authSlice.actions;
export default authSlice.reducer;