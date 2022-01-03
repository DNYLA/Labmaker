import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loadingDiscordConfig } from '../LoadingTypes';
import { GuildConfig } from '../types';

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

export const { updateDiscord } = discordConfigSlice.actions;
