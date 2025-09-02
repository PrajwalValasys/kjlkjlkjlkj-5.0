import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserSlice {
  userInfo: any;
  isLoggedIn: boolean;
}

const initialState: UserSlice = {
  userInfo: null,
  isLoggedIn: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<any>) => {
      state.userInfo = action.payload;
      state.isLoggedIn = true;
    },
    clearUserInfo: (state) => {
      state.userInfo = null;
      state.isLoggedIn = false;
    },
  },
});

export const { setUserInfo, clearUserInfo } = userSlice.actions;
export default userSlice.reducer;
