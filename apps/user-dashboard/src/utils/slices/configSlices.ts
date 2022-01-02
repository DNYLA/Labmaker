import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loadingDiscordConfig, loadingRedditConfig } from '../LoadingTypes';
import { GuildConfig, RedditConfig } from '../types';

export const discordConfigSlice = createSlice({
  name: 'discordConfig',
  initialState: {
    value: loadingDiscordConfig,
  },
  reducers: {
    setDiscordConfig: (state, action: PayloadAction<GuildConfig>) => {
      state.value = action.payload;
    },
  },
});

export const redditConfigSlice = createSlice({
  name: 'redditConfigs',
  initialState: {
    value: new Array<RedditConfig>(),
  },
  reducers: {
    addRedditConfigs: (state, action: PayloadAction<RedditConfig[]>) => {
      action.payload.forEach((c) => state.value.push(c));
      // state.value.push(action.payload);
    },
    setRedditConfig: (state, action: PayloadAction<RedditConfig>) => {
      state.value = state.value.map((c) =>
        c.id === action.payload.id ? action.payload : c
      );
    },
    removeConfig: (state, action: PayloadAction<RedditConfig>) => {
      state.value = state.value.filter((c) => c.id !== action.payload.id);
    },
  },
});

export const { addRedditConfigs, setRedditConfig, removeConfig } =
  redditConfigSlice.actions;

export const { setDiscordConfig } = discordConfigSlice.actions;
