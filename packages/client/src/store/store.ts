import { configureStore } from '@reduxjs/toolkit';

// eslint-disable-next-line import/prefer-default-export
export const store = configureStore({
  reducer: {},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
