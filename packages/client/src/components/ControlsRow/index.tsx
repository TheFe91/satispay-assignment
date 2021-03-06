import { Input, Select } from 'antd';
import React, { BaseSyntheticEvent, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { useDispatch, useSelector } from 'react-redux';

import PokemonQueryResult, { PokemonByTypeQueryVars, PokemonQueryVars } from '@Interfaces/interfaces';
import queries from '@Helpers/queries';
import selectors from '@State/selectors';
import { setCurrentQuery, setCurrentSearch, setCurrentTypeFilter } from '@State/pokemonSlice';
import './_styles.css';
import thunks from '@State/thunks';
import { PerformSearchOptions, PerformSearchOrFilterType } from '@State/interfaces';

const { performSearchOrFilter } = thunks;

const {
  getCurrentPageSize,
  getCurrentTypeFilter,
  getCurrentSearch,
  getIsErrorFilters,
  getFilters,
} = selectors;

const { Search } = Input;
const { Option } = Select;

function ControlsRow() {
  const dispatch = useDispatch();

  const [searchInputValue, setSearchInputValue] = useState(undefined);

  const currentPageSize: number = useSelector(getCurrentPageSize);
  const currentTypeFilter: string | undefined = useSelector(getCurrentTypeFilter);
  const currentSearch: string | undefined = useSelector(getCurrentSearch);
  const isErrorFilters: boolean = useSelector(getIsErrorFilters);
  const filters: Array<string> = useSelector(getFilters);

  const [pokemons] = useLazyQuery<PokemonQueryResult, PokemonQueryVars>(queries.POKEMONS);
  const [pokemonsByType] = useLazyQuery<PokemonQueryResult, PokemonByTypeQueryVars>(queries.POKEMONS_BY_TYPE);

  const handleOnChangeSearchInputValue = ({ target: { value } }: BaseSyntheticEvent) => {
    setSearchInputValue(value);
  };

  const handleSearching = async (value: string) => {
    const onSuccess = () => {
      dispatch(setCurrentSearch(value));
      dispatch(setCurrentTypeFilter(undefined));
      dispatch(setCurrentQuery(value && !currentTypeFilter ? 'POKEMONS' : 'POKEMONS_BY_TYPE'));
    };

    const options: PerformSearchOptions = value
      ? {
        variables: {
          q: value,
          limit: currentPageSize,
        },
      }
      : {
        variables: {
          type: currentTypeFilter,
          limit: currentPageSize,
        },
      };

    const performSearchOrFilterInput: PerformSearchOrFilterType = {
      executor: value ? pokemons : pokemonsByType,
      options,
      onSuccess,
    };

    dispatch(performSearchOrFilter(performSearchOrFilterInput));
  };

  const handleOnSelectChange = async (value: string) => {
    const onSuccess = () => {
      setSearchInputValue(undefined);
      dispatch(setCurrentSearch(undefined));
      dispatch(setCurrentTypeFilter(value));
      dispatch(setCurrentQuery(value ? 'POKEMONS_BY_TYPE' : 'POKEMONS'));
    };

    const options: PerformSearchOptions = value
      ? {
        variables: {
          type: value,
          limit: currentPageSize,
        },
      } : {
        variables: {
          q: currentSearch,
          limit: currentPageSize,
        },
      };

    const performSearchOrFilterInput: PerformSearchOrFilterType = {
      executor: value ? pokemonsByType : pokemons,
      options,
      onSuccess,
    };

    dispatch(performSearchOrFilter(performSearchOrFilterInput));
  };

  return (
    <div className="controls-row">
      <Search
        onChange={handleOnChangeSearchInputValue}
        onSearch={handleSearching}
        placeholder="Filter by Pok??mon"
        style={{ width: 200 }}
        value={searchInputValue}
      />

      {isErrorFilters
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
