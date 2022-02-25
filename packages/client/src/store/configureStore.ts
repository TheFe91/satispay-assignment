import { configureStore } from '@reduxjs/toolkit';
import pokemonReducer from '@State/pokemonSlice';

// eslint-disable-next-line import/prefer-default-export
export const store = configureStore({
  reducer: {
    pokemon: pokemonReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
