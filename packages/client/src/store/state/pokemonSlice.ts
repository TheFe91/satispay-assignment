/* eslint-disable no-param-reassign */
import {
  ActionReducerMapBuilder, createSlice, Draft, PayloadAction, SerializedError,
} from '@reduxjs/toolkit';
import { QueryAdapterData } from '@Interfaces/interfaces';
import { NoInfer } from '@reduxjs/toolkit/dist/tsHelpers';
import { ExecuteQueryName, ExecuteQueryReturnType } from '@State/interfaces';
import thunks from './thunks';

const { executeQuery, performSearchOrFilter, performLoadMore } = thunks;

const STANDARD_PAGE_SIZE: number = 10;

interface QueryAdapterDataWithFlags {
  isFetching: boolean;
  isFetched: boolean;
  isError: boolean;
  error?: SerializedError;
  item: QueryAdapterData;
}

interface FiltersWithFlags {
  isFetching: boolean;
  isFetched: boolean;
  isError: boolean;
  error?: SerializedError;
  item: Array<string>;
}

export interface PokemonState {
  currentSearch: string | undefined;
  currentTypeFilter: string | undefined;
  currentPageSize: number;
  currentQuery: string;
  filters: FiltersWithFlags;
  data: QueryAdapterDataWithFlags;
}

const initialState: PokemonState = {
  currentSearch: undefined,
  currentTypeFilter: undefined,
  currentPageSize: STANDARD_PAGE_SIZE,
  currentQuery: 'POKEMONS',
  filters: {
    isFetching: false,
    isFetched: false,
    isError: false,
    error: undefined,

    item: [],
  },
  data: {
    isFetching: false,
    isFetched: false,
    isError: false,
    error: undefined,

    item: {
      nodes: [],
      dataSource: [],
      hasNextPage: false,
      endCursor: '',
    },
  },
};

export const pokemonSlice = createSlice({
  name: 'pokemon',
  initialState,
  reducers: {
    setCurrentSearch: (state: Draft<PokemonState>, action: PayloadAction<string | undefined>) => {
      state.currentSearch = action.payload;
    },
    setCurrentTypeFilter: (state: Draft<PokemonState>, action: PayloadAction<string | undefined>) => {
      state.currentTypeFilter = action.payload;
    },
    setCurrentPageSize: (state: Draft<PokemonState>, action: PayloadAction<number>) => {
      state.currentPageSize = action.payload;
    },
    setCurrentQuery: (state: Draft<PokemonState>, action: PayloadAction<string>) => {
      state.currentQuery = action.payload;
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<NoInfer<PokemonState>>) => {
    builder
      .addCase(executeQuery.pending, (state: Draft<PokemonState>, action) => {
        const { name } = action.meta.arg;

        if (name === ExecuteQueryName.FILTERS) {
          state.filters.isFetching = true;
          state.filters.isFetched = false;
          state.filters.isError = false;
        } else {
          state.data.isFetching = true;
          state.data.isFetched = false;
          state.data.isError = false;
        }
      })
      .addCase(executeQuery.fulfilled, (state: Draft<PokemonState>, action: PayloadAction<ExecuteQueryReturnType>) => {
        const { name, value } = action.payload;

        if (name === ExecuteQueryName.FILTERS) {
          state.filters.isFetching = false;
          state.filters.isFetched = true;
          state.filters.isError = false;
          state.filters.item = value as Array<string>;
        } else {
          state.data.isFetching = false;
          state.data.isFetched = true;
          state.data.isError = false;
          state.data.item = value as QueryAdapterData;
        }
      })
      .addCase(executeQuery.rejected, (state: Draft<PokemonState>, action) => {
        const { name } = action.meta.arg;

        if (name === ExecuteQueryName.FILTERS) {
          state.filters.isFetching = false;
          state.filters.isFetched = false;
          state.filters.isError = true;
          state.filters.error = action.error;
        } else {
          state.data.isFetching = false;
          state.data.isFetched = false;
          state.data.isError = true;
          state.data.error = action.error;
        }
      })

      .addCase(performSearchOrFilter.pending, (state: Draft<PokemonState>) => {
        state.data.isFetching = true;
        state.data.isFetched = false;
        state.data.isError = false;
      })
      .addCase(performSearchOrFilter.fulfilled, (state: Draft<PokemonState>, action: PayloadAction<QueryAdapterData>) => {
        state.data.isFetching = false;
        state.data.isFetched = true;
        state.data.isError = false;

        state.data.item = action.payload;
      })
      .addCase(performSearchOrFilter.rejected, (state: Draft<PokemonState>, action) => {
        state.data.isFetching = false;
        state.data.isFetched = false;
        state.data.isError = true;
        state.data.error = action.error;
      })

      .addCase(performLoadMore.pending, (state: Draft<PokemonState>) => {
        state.filters.isFetching = true;
        state.filters.isFetched = false;
        state.filters.isError = false;
      })
      .addCase(performLoadMore.fulfilled, (state: Draft<PokemonState>, action) => {
        const data = action.payload;

        state.data.item = data;
        state.currentPageSize = data.dataSource.length;
      })
      .addCase(performLoadMore.rejected, (state: Draft<PokemonState>, action) => {
        state.filters.isFetching = false;
        state.filters.isFetched = false;
        state.filters.isError = true;
        state.filters.error = action.error;
      });
  },
});

export const {
  setCurrentSearch,
  setCurrentTypeFilter,
  setCurrentPageSize,
  setCurrentQuery,
} = pokemonSlice.actions;

export default pokemonSlice.reducer;
