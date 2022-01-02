import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserDto } from '@labmaker/wrapper';
import { defaultUser } from 'apps/user-dashboard/src/utils/LoadingTypes';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    value: defaultUser,
  },
  reducers: {
    setUser: (state, action: PayloadAction<UserDto>) => {
      state.value = action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;
