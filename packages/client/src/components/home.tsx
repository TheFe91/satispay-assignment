import React, { useEffect } from 'react';
import { LazyQueryResult, useLazyQuery, useQuery } from '@apollo/client';
import { useDispatch } from 'react-redux';
import GqlDataAdapter, { GqlTypesAdapter } from '../helpers/gql_data_adapter';
import PokemonQueryResult, { PokemonByTypeQueryVars, PokemonQueryVars, QueryAdapterData } from '../interfaces/interfaces';
import queries from '../helpers/queries';
import './home.css';
import ControlsRow from './ControlsRow';
import Error from './Error';
import Logo from './Logo';
import LoadMore from './LoadMore';
import MainTable from './MainTable';
import { setFilters, setData } from '../store/state/pokemonSlice';

function Home() {
  const dispatch = useDispatch();

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

        <MainTable
          pbtLoading={pbtLoading}
          pLoading={pLoading}
          tLoading={tLoading}
        />

        <LoadMore
          pbtFetchMore={pbtFetchMore}
          pFetchMore={pFetchMore}
        />

      </div>
    );
}

export default Home;
