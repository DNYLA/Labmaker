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
    // value: LabmakerAPI.Reddit.getOne('3630aeb2-38c5-4c36-a0d5-5c2d95fa35b0'),
  },
  reducers: {
    updateReddit: (state, action: PayloadAction<Node>) => {
      state.value = action.payload;
    },
  },
});

export const { updateReddit } = redditConfigSlice.actions;
export const { updateDiscord } = discordConfigSlice.actions;
