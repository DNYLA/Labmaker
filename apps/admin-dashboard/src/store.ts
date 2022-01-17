import { configureStore } from '@reduxjs/toolkit';
import { guildSlice } from './utils/slices/configSlices';
import { userSlice } from './utils/slices/userSlice';

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    guild: guildSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
