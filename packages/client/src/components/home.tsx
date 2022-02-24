import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import {
  DocumentNode, LazyQueryResult, useLazyQuery, useQuery,
} from '@apollo/client';
import GqlDataAdapter, { GqlTypesAdapter } from '../helpers/gql_data_adapter';
import PokemonQueryResult, { PokemonByTypeQueryVars, PokemonQueryVars, QueryAdapterData } from '../interfaces/interfaces';
import queries from '../helpers/queries';
import './home.css';
import ControlsRow from './ControlsRow';
import Error from './Error';
import Logo from './Logo';
import LoadMore from './LoadMore';

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
  const [filters, setFilters] = useState<Array<string>>([]);

  const [data, setData] = useState<QueryAdapterData>({
    nodes: [], dataSource: [], hasNextPage: false, endCursor: '',
  });

  const { loading: tLoading, error: tError, data: tData } = useQuery(queries.TYPES);

  const [pokemons, {
    loading: pLoading, error: pError, fetchMore: pFetchMore,
  }] = useLazyQuery<PokemonQueryResult, PokemonQueryVars>(queries.POKEMONS);

  const [, {
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

  return pError || pbtError
    ? <Error />
    : (
      <div className="container">

        <Logo />

        <ControlsRow
          currentPageSize={currentPageSize}
          currentSearch={currentSearch}
          currentTypeFilter={currentTypeFilter}
          filters={filters}
          setCurrentQuery={setCurrentQuery}
          setCurrentSearch={setCurrentSearch}
          setCurrentTypeFilter={setCurrentTypeFilter}
          setData={setData}
          tError={tError}
        />

        <Table
          bordered
          columns={columns}
          dataSource={data.dataSource}
          loading={pLoading || pbtLoading || tLoading}
          pagination={false}
        />

        <LoadMore
          currentQuery={currentQuery}
          currentSearch={currentSearch}
          currentTypeFilter={currentTypeFilter}
          data={data}
          pbtFetchMore={pbtFetchMore}
          pFetchMore={pFetchMore}
          setCurrentPageSize={setCurrentPageSize}
          setData={setData}
        />
      </div>
    );
}

export default Home;
