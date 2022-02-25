import { ApolloQueryResult } from '@apollo/client';
import { Button } from 'antd';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PokemonQueryResult, { QueryAdapterData } from '../../interfaces/interfaces';
import GqlDataAdapter from '../../helpers/gql_data_adapter';
import selectors from '../../store/state/selectors';
import { setData, setCurrentPageSize } from '../../store/state/pokemonSlice';
import './_styles.css';

const {
  getData, getCurrentQuery, getCurrentSearch, getCurrentTypeFilter,
} = selectors;

interface LoadMoreProps {
  pFetchMore: Function;
  pbtFetchMore: Function;
}

function LoadMore({
  pFetchMore,
  pbtFetchMore,
}: LoadMoreProps) {
  const dispatch = useDispatch();

  const currentQuery: string = useSelector(getCurrentQuery);
  const currentSearch: string | undefined = useSelector(getCurrentSearch);
  const currentTypeFilter: string | undefined = useSelector(getCurrentTypeFilter);
  const {
    endCursor, hasNextPage, dataSource, nodes,
  }: QueryAdapterData = useSelector(getData);

  const handleLoadMore = async () => {
    const response: ApolloQueryResult<PokemonQueryResult> = currentQuery === 'POKEMONS'
      ? await pFetchMore({
        variables: {
          q: currentSearch,
          after: endCursor,
        },
      })
      : await pbtFetchMore({
        variables: {
          type: currentTypeFilter,
          after: endCursor,
        },
      });

    const adaptedData = GqlDataAdapter(response.data);
    const newData: QueryAdapterData = {
      dataSource: [...dataSource, ...adaptedData.dataSource],
      nodes: [...nodes, ...adaptedData.nodes],
      endCursor: adaptedData.endCursor,
      hasNextPage: adaptedData.hasNextPage,
    };
    dispatch(setData(newData));
    dispatch(setCurrentPageSize(newData.dataSource.length));
  };

  return (
    <div className="load-more-container">
      <Button
        disabled={!hasNextPage}
        onClick={handleLoadMore}
        shape="round"
        size="large"
        type="primary"
      >
        Load more
      </Button>
    </div>
  );
}

export default LoadMore;
