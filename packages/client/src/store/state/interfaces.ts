import { PokemonByTypeQueryVars, PokemonQueryVars, QueryAdapterData } from '@Interfaces/interfaces';

interface ExecuteQueryReturnType {
  name: ExecuteQueryName;
  value: Array<string> | QueryAdapterData;
}

interface ExecuteQueryInputType {
  name: ExecuteQueryName;
  executor: Function;
}

interface PerformSearchOptions {
  variables: PokemonQueryVars | PokemonByTypeQueryVars;
}

interface PerformSearchInputType {
  executor: Function;
  options?: PerformSearchOptions;
  onSuccess: Function;
}

export enum ExecuteQueryName {
  FILTERS = 'FILTERS',
  POKEMONS = 'POKEMON',
  POKEMONS_BY_TYPE = 'POKEMONS_BY_TYPE',
}

export type {
  ExecuteQueryInputType,
  ExecuteQueryReturnType,

  PerformSearchInputType,
};
