import { GuildConfig, GuildData, Payment } from '@labmaker/shared';
import { Item } from '@labmaker/ui';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loadingDiscordConfig } from '../LoadingTypes';

const initialStateValue: GuildData & { parsedGuilds: Item[] } = {
  config: loadingDiscordConfig,
  payments: [],
  channels: [],
  roles: [],
  parsedGuilds: [],
};

export const guildSlice = createSlice({
  name: 'guildConfig',
  initialState: initialStateValue,
  reducers: {
    setGuild: (state, action: PayloadAction<GuildData>) => {
      state.config = action.payload.config;
      state.payments = action.payload.payments;
    },
    setConfig: (state, action: PayloadAction<GuildConfig>) => {
      state.config = action.payload;
    },
    setPayments: (state, action: PayloadAction<Payment[]>) => {
      state.payments = action.payload;
    },
    setParsedGuilds: (state, action: PayloadAction<Item[]>) => {
      state.parsedGuilds = action.payload;
    },
  },
});

export const { setGuild, setConfig, setPayments, setParsedGuilds } =
  guildSlice.actions;
