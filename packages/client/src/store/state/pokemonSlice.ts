/* eslint-disable no-param-reassign */
import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';
import { QueryAdapterData } from '../../interfaces/interfaces';

const STANDARD_PAGE_SIZE: number = 10;

export interface CounterState {
  currentSearch: string | undefined;
  currentTypeFilter: string | undefined;
  currentPageSize: number;
  currentQuery: string;
  filters: Array<string>;
  data: QueryAdapterData;
}

const initialState: CounterState = {
  currentSearch: undefined,
  currentTypeFilter: undefined,
  currentPageSize: STANDARD_PAGE_SIZE,
  currentQuery: 'POKEMONS',
  filters: [],
  data: {
    nodes: [],
    dataSource: [],
    hasNextPage: false,
    endCursor: '',
  },
};

export const pokemonSlice = createSlice({
  name: 'pokemon',
  initialState,
  reducers: {
    setCurrentSearch: (state: Draft<CounterState>, action: PayloadAction<string | undefined>) => {
      state.currentSearch = action.payload;
    },
    setCurrentTypeFilter: (state: Draft<CounterState>, action: PayloadAction<string | undefined>) => {
      state.currentTypeFilter = action.payload;
    },
    setCurrentPageSize: (state: Draft<CounterState>, action: PayloadAction<number>) => {
      state.currentPageSize = action.payload;
    },
    setCurrentQuery: (state: Draft<CounterState>, action: PayloadAction<string>) => {
      state.currentQuery = action.payload;
    },
    setFilters: (state: Draft<CounterState>, action: PayloadAction<Array<string>>) => {
      state.filters = action.payload;
    },
    setData: (state: Draft<CounterState>, action: PayloadAction<QueryAdapterData>) => {
      state.data = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setCurrentSearch,
  setCurrentTypeFilter,
  setCurrentPageSize,
  setCurrentQuery,
  setFilters,
  setData,
} = pokemonSlice.actions;

export default pokemonSlice.reducer;
