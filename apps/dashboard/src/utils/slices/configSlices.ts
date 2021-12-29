import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loadingDiscordConfig, loadingRedditConfig } from '../LoadingTypes';
import { GuildConfig, Node } from '../types';

export const discordConfigSlice = createSlice({
  name: 'discordConfig',
  initialState: {
    value: loadingDiscordConfig,
  },
  reducers: {
    updateDiscord: (state, action: PayloadAction<GuildConfig>) => {
      state.value = action.payload;
    },
  },
});

export const redditConfigSlice = createSlice({
  name: 'redditConfig',
  initialState: {
    value: loadingRedditConfig,
  },
  reducers: {
    updateReddit: (state, action: PayloadAction<Node>) => {
      state.value = action.payload;
    },
  },
});

export const { updateReddit } = redditConfigSlice.actions;
export const { updateDiscord } = discordConfigSlice.actions;
