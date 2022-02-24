import { Input, Select } from 'antd';
import React from 'react';
import { LazyQueryResult } from '@apollo/client';
import PokemonQueryResult, { PokemonByTypeQueryVars, PokemonQueryVars, QueryAdapterData } from '../interfaces/interfaces';
import GqlDataAdapter from '../helpers/gql_data_adapter';
import queries from '../helpers/queries';

const { Search } = Input;

function ControlsRow() {
  const handleSearching = async (value: string) => {
    const response: LazyQueryResult<PokemonQueryResult, PokemonQueryVars | PokemonByTypeQueryVars> = value
      ? await pokemons({
        variables: {
          q: value,
          limit: currentPageSize,
        },
      })
      : currentTypeFilter
        ? await pokemonsByType({
          variables: {
            type: currentTypeFilter,
            limit: currentPageSize,
          },
        })
        : await pokemons({
          variables: {
            limit: currentPageSize,
          },
        });

    if (response.data) {
      const adaptedData: QueryAdapterData = GqlDataAdapter(response.data);
      setData(adaptedData);
    }
    setCurrentSearch(value);
    setCurrentQuery(value && !currentTypeFilter ? queries.POKEMONS : queries.POKEMONS_BY_TYPE);
  };

  const handleOnSelectChange = async (value: string | undefined) => {
    const response: LazyQueryResult<PokemonQueryResult, PokemonQueryVars | PokemonByTypeQueryVars> = value
      ? await pokemonsByType({
        variables: {
          type: value,
          limit: currentPageSize,
        },
      }) : await pokemons({
        variables: {
          q: currentSearch,
          limit: currentPageSize,
        },
      });

    if (response.data) {
      const adaptedData: QueryAdapterData = GqlDataAdapter(response.data);
      setData(adaptedData);
    }
    setCurrentTypeFilter(value);
    setCurrentQuery(value ? queries.POKEMONS_BY_TYPE : queries.POKEMONS);
  };

  return (
    <div className="controls-row">
      <Search onSearch={handleSearching} placeholder="Filter by Pokémon" style={{ width: 200 }} />

      {tError
        ? (<p>Filtering by type is not available</p>)
        : (
          <Select
            allowClear
            onChange={handleOnSelectChange}
            optionFilterProp="children"
            placeholder="Filter by type"
            showSearch
            style={{ width: 200 }}
          >
            {filters.map((filter: string) => <Option key={filter} value={filter}>{filter}</Option>)}
          </Select>
        )}

      Showing
      {' '}

      <strong>{currentPageSize}</strong>

      {' '}
      results
    </div>
  );
}

export default ControlsRow;
