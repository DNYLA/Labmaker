import { GuildConfigDto } from '@labmaker/wrapper';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loadingDiscordConfig } from '../LoadingTypes';

export const discordConfigSlice = createSlice({
  name: 'discordConfig',
  initialState: {
    value: loadingDiscordConfig,
  },
  reducers: {
    setDiscordConfig: (state, action: PayloadAction<GuildConfigDto>) => {
      state.value = action.payload;
    },
  },
});

export const { setDiscordConfig } = discordConfigSlice.actions;
