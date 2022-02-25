import React, { useEffect } from 'react';
import { LazyQueryResult, useLazyQuery, useQuery } from '@apollo/client';
import { useDispatch } from 'react-redux';

import PokemonQueryResult, { PokemonByTypeQueryVars, PokemonQueryVars, QueryAdapterData } from '@Interfaces/interfaces';
import { setFilters, setData } from '@State/pokemonSlice';
import GqlDataAdapter, { GqlTypesAdapter } from '@Helpers/gql_data_adapter';
import queries from '@Helpers/queries';
import ControlsRow from '@Components/ControlsRow';
import Error from '@Components/Error';
import Logo from '@Components/Logo';
import LoadMore from '@Components/LoadMore';
import MainTable from '@Components/MainTable';
import './_styles.css';

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
