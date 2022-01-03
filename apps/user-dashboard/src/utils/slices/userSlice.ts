import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserDto } from '@labmaker/wrapper';
import { defaultUser } from '../../utils/LoadingTypes';
import { RedditConfig } from '../../utils/types';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    value: defaultUser,
  },
  reducers: {
    setUser: (state, action: PayloadAction<UserDto>) => {
      state.value = action.payload;
    },
    addConfigs: (state, action: PayloadAction<RedditConfig[]>) => {
      //Somewhere Inside Home.tsx RedditConfig Node gets duplicated
      //to prevent this we can loop through the payload and check if it already
      //exists before inserting it
      action.payload.forEach((c) => {
        const exists = state.value.nodes.findIndex(
          (config) => config.id === c.id
        );
        if (exists >= 0) {
          state.value.nodes[exists] = c;
        } else {
          state.value.nodes.push(c);
        }
        // state.value.nodes.push(c);
      });
    },
    setConfig: (state, action: PayloadAction<RedditConfig>) => {
      state.value.nodes = state.value.nodes.map((c) =>
        c.id === action.payload.id ? action.payload : c
      );
    },
    deleteConfig: (state, action: PayloadAction<RedditConfig>) => {
      state.value.nodes = state.value.nodes.filter(
        (c) => c.id !== action.payload.id
      );
    },
  },
});

export const { setUser, addConfigs, setConfig, deleteConfig } =
  userSlice.actions;
