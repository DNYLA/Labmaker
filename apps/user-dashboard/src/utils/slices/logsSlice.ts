import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loadingLogs } from '../LoadingTypes';
import { Log } from '../types';

export const logsSlice = createSlice({
  name: 'logs',
  initialState: {
    value: [loadingLogs],
  },
  reducers: {
    setLogs: (state, action: PayloadAction<Log[]>) => {
      state.value = action.payload;
    },
    addLog: (state, action: PayloadAction<Log>) => {
      state.value.push(action.payload);
    },
  },
});

export const { setLogs, addLog } = logsSlice.actions;
