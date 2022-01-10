import { LogDto } from '@labmaker/wrapper';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loadingLogs } from '../LoadingTypes';

export const logsSlice = createSlice({
  name: 'logs',
  initialState: {
    value: [loadingLogs],
  },
  reducers: {
    setLogs: (state, action: PayloadAction<LogDto[]>) => {
      state.value = action.payload;
    },
    addLog: (state, action: PayloadAction<LogDto>) => {
      state.value.push(action.payload);
    },
  },
});

export const { setLogs, addLog } = logsSlice.actions;
