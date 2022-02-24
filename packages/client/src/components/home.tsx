import React, { useEffect, useState } from 'react';
import { Button, Table } from 'antd';
import {
  ApolloQueryResult, DocumentNode, LazyQueryResult, useLazyQuery, useQuery,
} from '@apollo/client';
import GqlDataAdapter, { GqlTypesAdapter } from '../helpers/gql_data_adapter';
import PokemonQueryResult, { PokemonByTypeQueryVars, PokemonQueryVars, QueryAdapterData } from '../interfaces/interfaces';
import queries from '../helpers/queries';
import './home.css';
import ControlsRow from './ControlsRow';
import Error from './Error';
import Logo from './Logo';

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

const STANDARD_PAGE_SIZE: number = 10;

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

  return pError || pbtError
    ? <Error />
    : (
      <div className="container">

        <Logo />

        <ControlsRow />

        <Table
          columns={columns}
          dataSource={data.dataSource}
          loading={pLoading || pbtLoading || tLoading}
          pagination={false}
        />

        <div className="load-more-container">
          <Button disabled={!data.hasNextPage} onClick={handleLoadMore} shape="round" size="large" type="primary">
            Load more
          </Button>
        </div>
      </div>
    );
}

export default Home;
