import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserDto } from '@labmaker/wrapper';

const loadingUser: UserDto & { loading?: boolean } = {
  id: '0',
  username: 'Username',
  discriminator: '4444',
  avatar: 'http://google.com',
  nodes: [],
  editableNodes: [],
  loading: true,
};

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    value: loadingUser,
  },
  reducers: {
    updateUser: (state, action: PayloadAction<UserDto>) => {
      state.value = action.payload;
    },
  },
});

export const { updateUser } = userSlice.actions;
