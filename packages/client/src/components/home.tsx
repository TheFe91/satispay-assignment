import React, { useEffect, useState } from 'react';
import {
  Button, Input, Result, Select, Table,
} from 'antd';
import {
  ApolloQueryResult, DocumentNode, LazyQueryResult, useLazyQuery, useQuery,
} from '@apollo/client';
import GqlDataAdapter, { GqlTypesAdapter } from '../helpers/gql_data_adapter';
import PokemonQueryResult, { PokemonByTypeQueryVars, PokemonQueryVars, QueryAdapterData } from '../interfaces/interfaces';
import queries from '../helpers/queries';
import './home.css';

const { Search } = Input;
const { Option } = Select;

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Types',
    dataIndex: 'types',
    key: 'types',
  },
  {
    title: 'Classification',
    dataIndex: 'classification',
    key: 'classification',
  },
];

const STANDARD_PAGE_SIZE = 10;

function Home() {
  const [currentSearch, setCurrentSearch] = useState<string | undefined>(undefined);
  const [currentTypeFilter, setCurrentTypeFilter] = useState<string | undefined>(undefined);
  const [currentPageSize, setCurrentPageSize] = useState<number>(STANDARD_PAGE_SIZE);
  const [currentQuery, setCurrentQuery] = useState<DocumentNode>(queries.POKEMONS);
  const [filters, setFilters] = useState<string[]>([]);

  const [data, setData] = useState<QueryAdapterData>({
    nodes: [], dataSource: [], hasNextPage: false, endCursor: '',
  });

  const { loading: tLoading, error: tError, data: tData } = useQuery(queries.TYPES);

  const [pokemons, {
    loading: pLoading, error: pError, fetchMore: pFetchMore,
  }] = useLazyQuery<PokemonQueryResult, PokemonQueryVars>(queries.POKEMONS);

  const [pokemonsByType, {
    loading: pbtLoading, error: pbtError, fetchMore: pbtFetchMore,
  }] = useLazyQuery<PokemonQueryResult, PokemonByTypeQueryVars>(queries.POKEMONS_BY_TYPE);

  useEffect(() => {
    setFilters(GqlTypesAdapter(tData));
  }, [tData]);

  useEffect(() => {
    pokemons().then((response: LazyQueryResult<PokemonQueryResult, PokemonQueryVars>) => {
      if (response.data) {
        const adaptedData: QueryAdapterData = GqlDataAdapter(response.data);
        setData(adaptedData);
      }
    });
  }, [pokemons]);

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

  const handleLoadMore = async () => {
    const response: ApolloQueryResult<PokemonQueryResult> = currentQuery === queries.POKEMONS
      ? await pFetchMore({
        variables: {
          q: currentSearch,
          after: data.endCursor,
        },
      })
      : await pbtFetchMore({
        variables: {
          type: currentTypeFilter,
          after: data.endCursor,
        },
      });

    const adaptedData = GqlDataAdapter(response.data);
    const newData: QueryAdapterData = {
      dataSource: [...data.dataSource, ...adaptedData.dataSource],
      nodes: [...data.nodes, ...adaptedData.nodes],
      endCursor: adaptedData.endCursor,
      hasNextPage: adaptedData.hasNextPage,
    };
    setData(newData);
    setCurrentPageSize(newData.dataSource.length);
  };

  return pError || pbtError ? (
    <Result
      status="warning"
      title="There were issues while retrieving the data"
    />
  ) : (
    <div className="container">
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

      <Table
        columns={columns}
        dataSource={data.dataSource}
        loading={pLoading || pbtLoading || tLoading}
        pagination={false}
      />

      <div className="load-more-btn">
        <Button disabled={!data.hasNextPage} onClick={handleLoadMore}>Load more</Button>
      </div>
    </div>
  );
}

export default Home;
