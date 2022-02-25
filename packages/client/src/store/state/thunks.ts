import { createAsyncThunk } from '@reduxjs/toolkit';
import { LazyQueryResult } from '@apollo/client';
import PokemonQueryResult, {
  PokemonByTypeQueryVars,
  PokemonQueryVars,
  QueryAdapterData,
} from '@Interfaces/interfaces';
import {
  ExecuteQueryInputType,
  ExecuteQueryName,
  ExecuteQueryReturnType,
  PerformSearchInputType,
} from '@State/interfaces';
import GqlDataAdapter, { GqlTypesAdapter } from '@Helpers/gql_data_adapter';

const executeQuery = createAsyncThunk<ExecuteQueryReturnType, ExecuteQueryInputType>(
  'pokemon/executeQuery',
  async ({ name, executor }) => {
    const response: LazyQueryResult<PokemonQueryResult, PokemonQueryVars> = await executor();
    if (response.data) {
      return {
        name,
        value: name === ExecuteQueryName.FILTERS ? GqlTypesAdapter(response.data) : GqlDataAdapter(response.data),
      };
    }

    return {
      name,
      value: [],
    };
  },
);

const performSearch = createAsyncThunk<QueryAdapterData, PerformSearchInputType>(
  'pokemon/performSearch',
  async ({ executor, options, onSuccess }) => {
    const response: LazyQueryResult<PokemonQueryResult, PokemonQueryVars | PokemonByTypeQueryVars> = await executor(options);

    if (response.data) {
      onSuccess();
      return GqlDataAdapter(response.data);
    }

    return {
      hasNextPage: false,
      endCursor: '',
      dataSource: [],
      nodes: [],
    };
  },
);

export default {
  executeQuery,
  performSearch,
};
