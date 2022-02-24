import { ApolloQueryResult, DocumentNode } from '@apollo/client';
import { Button } from 'antd';
import React from 'react';
import PokemonQueryResult, { QueryAdapterData } from '../interfaces/interfaces';
import queries from '../helpers/queries';
import GqlDataAdapter from '../helpers/gql_data_adapter';

interface LoadMoreProps {
  currentQuery: DocumentNode;
  pFetchMore: Function;
  currentSearch: string | undefined;
  data: QueryAdapterData;
  pbtFetchMore: Function;
  currentTypeFilter: string | undefined;
  setData: Function;
  setCurrentPageSize: Function;
}

function LoadMore({
  currentQuery,
  pFetchMore,
  currentSearch,
  data,
  pbtFetchMore,
  currentTypeFilter,
  setData,
  setCurrentPageSize,
}: LoadMoreProps) {
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

  return (
    <div className="load-more-container">
      <Button
        disabled={!data.hasNextPage}
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
