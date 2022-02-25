import { Input, Select } from 'antd';
import React, { BaseSyntheticEvent, useState } from 'react';
import { ApolloError, LazyQueryResult, useLazyQuery } from '@apollo/client';
import { useDispatch, useSelector } from 'react-redux';

import PokemonQueryResult, { PokemonByTypeQueryVars, PokemonQueryVars, QueryAdapterData } from '@Interfaces/interfaces';
import GqlDataAdapter from '@Helpers/gql_data_adapter';
import queries from '@Helpers/queries';
import selectors from '@State/selectors';
import {
  setData, setCurrentSearch, setCurrentQuery, setCurrentTypeFilter,
} from '@State/pokemonSlice';
import './_styles.css';

const {
  getCurrentPageSize,
  getCurrentTypeFilter,
  getCurrentSearch,
  getFilters,
} = selectors;

const { Search } = Input;
const { Option } = Select;

interface ControlsRowProps {
  tError: ApolloError | undefined;
}

function ControlsRow({ tError }: ControlsRowProps) {
  const dispatch = useDispatch();

  const [searchInputValue, setSearchInputValue] = useState(undefined);

  const currentPageSize: number = useSelector(getCurrentPageSize);
  const currentTypeFilter: string | undefined = useSelector(getCurrentTypeFilter);
  const currentSearch: string | undefined = useSelector(getCurrentSearch);
  const filters: Array<string> = useSelector(getFilters);

  const [pokemons] = useLazyQuery<PokemonQueryResult, PokemonQueryVars>(queries.POKEMONS);
  const [pokemonsByType] = useLazyQuery<PokemonQueryResult, PokemonByTypeQueryVars>(queries.POKEMONS_BY_TYPE);

  const handleOnChangeSearchInputValue = ({ target: { value } }: BaseSyntheticEvent) => {
    setSearchInputValue(value);
  };

  const handleSearching = async (value: string) => {
    const response: LazyQueryResult<PokemonQueryResult, PokemonQueryVars | PokemonByTypeQueryVars> = value
      ? await pokemons({
        variables: {
          q: value,
          limit: currentPageSize,
        },
      })
      : await pokemonsByType({
        variables: {
          type: currentTypeFilter,
          limit: currentPageSize,
        },
      });

    if (response.data) {
      const adaptedData: QueryAdapterData = GqlDataAdapter(response.data);
      dispatch(setData(adaptedData));
    }
    dispatch(setCurrentSearch(value));
    dispatch(setCurrentTypeFilter(undefined));
    dispatch(setCurrentQuery(value && !currentTypeFilter ? 'POKEMONS' : 'POKEMONS_BY_TYPE'));
  };

  const handleOnSelectChange = async (value: string) => {
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
      dispatch(setData(adaptedData));
    }
    setSearchInputValue(undefined);
    dispatch(setCurrentSearch(undefined));
    dispatch(setCurrentTypeFilter(value));
    dispatch(setCurrentQuery(value ? 'POKEMONS_BY_TYPE' : 'POKEMONS'));
  };

  return (
    <div className="controls-row">
      <Search
        onChange={handleOnChangeSearchInputValue}
        onSearch={handleSearching}
        placeholder="Filter by Pokémon"
        style={{ width: 200 }}
        value={searchInputValue}
      />

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
            value={currentTypeFilter}
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
