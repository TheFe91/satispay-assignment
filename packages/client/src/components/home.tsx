import React, { useEffect } from 'react';
import { Table } from 'antd';
import { LazyQueryResult, useLazyQuery, useQuery } from '@apollo/client';
import { useDispatch, useSelector } from 'react-redux';
import GqlDataAdapter, { GqlTypesAdapter } from '../helpers/gql_data_adapter';
import PokemonQueryResult, { PokemonByTypeQueryVars, PokemonQueryVars, QueryAdapterData } from '../interfaces/interfaces';
import queries from '../helpers/queries';
import './home.css';
import ControlsRow from './ControlsRow';
import Error from './Error';
import Logo from './Logo';
import LoadMore from './LoadMore';
import { setFilters, setData } from '../store/state/pokemonSlice';
import selectors from '../store/state/selectors';

const { getData } = selectors;

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

function Home() {
  const dispatch = useDispatch();
  const { dataSource }: QueryAdapterData = useSelector(getData);

  const { loading: tLoading, error: tError, data: tData } = useQuery(queries.TYPES);

  const [pokemons, {
    loading: pLoading,
    error: pError,
    fetchMore: pFetchMore,
  }] = useLazyQuery<PokemonQueryResult, PokemonQueryVars>(queries.POKEMONS);

  const [, {
    loading: pbtLoading,
    error: pbtError,
    fetchMore: pbtFetchMore,
  }] = useLazyQuery<PokemonQueryResult, PokemonByTypeQueryVars>(queries.POKEMONS_BY_TYPE);

  useEffect(() => {
    if (tData) {
      dispatch(setFilters(GqlTypesAdapter(tData)));
    }
  }, [dispatch, tData]);

  useEffect(() => {
    pokemons().then((response: LazyQueryResult<PokemonQueryResult, PokemonQueryVars>) => {
      if (response.data) {
        const adaptedData: QueryAdapterData = GqlDataAdapter(response.data);
        dispatch(setData(adaptedData));
      }
    });
  }, [dispatch, pokemons]);

  return pError || pbtError
    ? <Error />
    : (
      <div className="container">

        <Logo />

        <ControlsRow tError={tError} />

        <Table
          bordered
          columns={columns}
          dataSource={dataSource}
          loading={pLoading || pbtLoading || tLoading}
          pagination={false}
        />

        <LoadMore
          pbtFetchMore={pbtFetchMore}
          pFetchMore={pFetchMore}
        />
      </div>
    );
}

export default Home;
