import React, { useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import { useDispatch, useSelector } from 'react-redux';

import PokemonQueryResult, { PokemonByTypeQueryVars, PokemonQueryVars } from '@Interfaces/interfaces';
import thunks from '@State/thunks';
import queries from '@Helpers/queries';
import ControlsRow from '@Components/ControlsRow';
import Error from '@Components/Error';
import Logo from '@Components/Logo';
import LoadMore from '@Components/LoadMore';
import MainTable from '@Components/MainTable';
import './_styles.css';
import { ExecuteQueryInputType, ExecuteQueryName } from '@State/interfaces';
import selectors from '@State/selectors';

const { getIsErrorFilters, getIsErrorData } = selectors;

const { executeQuery } = thunks;

function Home() {
  const dispatch = useDispatch();
  const isErrorFilters: boolean = useSelector(getIsErrorFilters);
  const isErrorData: boolean = useSelector(getIsErrorData);

  const [fetchTypes] = useLazyQuery(queries.TYPES);

  const [pokemons, { fetchMore: pFetchMore }] = useLazyQuery<PokemonQueryResult, PokemonQueryVars>(queries.POKEMONS);

  const [, { fetchMore: pbtFetchMore }] = useLazyQuery<PokemonQueryResult, PokemonByTypeQueryVars>(queries.POKEMONS_BY_TYPE);

  useEffect(() => {
    const filtersInput: ExecuteQueryInputType = {
      name: ExecuteQueryName.FILTERS,
      executor: fetchTypes,
    };

    const pokemonsInput: ExecuteQueryInputType = {
      name: ExecuteQueryName.POKEMONS,
      executor: pokemons,
    };

    dispatch(executeQuery(filtersInput));
    dispatch(executeQuery(pokemonsInput));
  }, [dispatch, fetchTypes, pokemons]);

  return isErrorData || isErrorFilters
    ? <Error />
    : (
      <div className="container">

        <Logo />

        <ControlsRow />

        <MainTable />

        <LoadMore
          pbtFetchMore={pbtFetchMore}
          pFetchMore={pFetchMore}
        />

      </div>
    );
}

export default Home;
