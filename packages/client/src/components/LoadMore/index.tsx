import { Button } from 'antd';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { QueryAdapterData } from '@Interfaces/interfaces';
import selectors from '@State/selectors';
import thunks from '@State/thunks';
import './_styles.css';
import { PerformLoadMoreType, PerformSearchOptions } from '@State/interfaces';

const { performLoadMore } = thunks;

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
  const { endCursor, hasNextPage }: QueryAdapterData = useSelector(getData);

  const handleLoadMore = async () => {
    const options: PerformSearchOptions = currentQuery === 'POKEMONS'
      ? {
        variables: {
          q: currentSearch,
          after: endCursor,
        },
      }
      : {
        variables: {
          type: currentTypeFilter,
          after: endCursor,
        },
      };

    const executor: Function = currentQuery === 'POKEMONS' ? pFetchMore : pbtFetchMore;

    const loadMoreInput: PerformLoadMoreType = {
      executor,
      options,
    };

    dispatch(performLoadMore(loadMoreInput));
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
