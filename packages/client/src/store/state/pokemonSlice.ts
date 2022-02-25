/* eslint-disable no-param-reassign */
import {
  ActionReducerMapBuilder, createSlice, Draft, PayloadAction,
} from '@reduxjs/toolkit';
import { QueryAdapterData } from '@Interfaces/interfaces';
import { NoInfer } from '@reduxjs/toolkit/dist/tsHelpers';
import { ExecuteQueryName, ExecuteQueryReturnType } from '@State/interfaces';
import thunks from './thunks';

const { executeQuery, performSearchOrFilter } = thunks;

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
    setData: (state: Draft<CounterState>, action: PayloadAction<QueryAdapterData>) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<NoInfer<CounterState>>) => {
    builder
      .addCase(executeQuery.fulfilled, (state: Draft<CounterState>, action: PayloadAction<ExecuteQueryReturnType>) => {
        const { name, value } = action.payload;

        if (name === ExecuteQueryName.FILTERS) {
          state.filters = value as Array<string>;
        } else {
          state.data = value as QueryAdapterData;
        }
      })
      .addCase(performSearchOrFilter.fulfilled, (state: Draft<CounterState>, action: PayloadAction<QueryAdapterData>) => {
        state.data = action.payload;
      });
  },
});

// Action creators are generated for each case reducer function
export const {
  setCurrentSearch,
  setCurrentTypeFilter,
  setCurrentPageSize,
  setCurrentQuery,
  setData,
} = pokemonSlice.actions;

export default pokemonSlice.reducer;
