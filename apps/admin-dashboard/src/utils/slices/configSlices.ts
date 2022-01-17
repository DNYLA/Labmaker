import { Item } from '@labmaker/ui';
import { GuildConfig, GuildConfigDto, PaymentDto } from '@labmaker/wrapper';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loadingDiscordConfig } from '../LoadingTypes';

const initialStateValue: GuildConfig & { parsedGuilds: Item[] } = {
  config: loadingDiscordConfig,
  payments: [],
  parsedGuilds: [],
};

export const guildSlice = createSlice({
  name: 'guildConfig',
  initialState: initialStateValue,
  reducers: {
    setGuild: (state, action: PayloadAction<GuildConfig>) => {
      state.config = action.payload.config;
      state.payments = action.payload.payments;
    },
    setConfig: (state, action: PayloadAction<GuildConfigDto>) => {
      state.config = action.payload;
    },
    setPayments: (state, action: PayloadAction<PaymentDto[]>) => {
      state.payments = action.payload;
    },
    setParsedGuilds: (state, action: PayloadAction<Item[]>) => {
      state.parsedGuilds = action.payload;
    },
  },
});

export const { setGuild, setConfig, setPayments, setParsedGuilds } =
  guildSlice.actions;
