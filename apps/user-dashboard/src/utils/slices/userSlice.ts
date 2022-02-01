import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserDto, UserRole } from '@labmaker/wrapper';
// import { defaultUser } from '../../utils/LoadingTypes';
// import { RedditConfig } from '../../utils/types';

export const defaultUser: UserDto = {
  id: '-1',
  username: 'Username',
  discriminator: '4444',
  role: UserRole.USER,
  subjects: [],
};

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
