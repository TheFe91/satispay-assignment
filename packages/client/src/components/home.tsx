import React, { useEffect, useState } from 'react';
import {
  Button, Col,
  Input, Result, Row, Select, Table,
} from 'antd';
import { ApolloQueryResult, useQuery } from '@apollo/client';
import GqlDataAdapter from '../helpers/gql_data_adapter';
import PokemonQueryResult, { PokemonQueryVars, QueryAdapterData } from '../interfaces/interfaces';
import queries from '../helpers/queries';

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
  const [currentPageSize, setCurrentPageSize] = useState<number>(STANDARD_PAGE_SIZE);
  const [data, setData] = useState<QueryAdapterData>({
    nodes: [], dataSource: [], hasNextPage: false, endCursor: '',
  });
  const {
    loading, error, data: queryData, fetchMore,
  } = useQuery<PokemonQueryResult, PokemonQueryVars>(queries.POKEMONS, {
    variables: {

    },
  });

  useEffect(() => {
    if (queryData) {
      const adaptedData = GqlDataAdapter(queryData);
      setData(adaptedData);
    }
  }, [queryData]);

  const handleSearching = async (value: string | undefined) => {
    setCurrentSearch(value);
    const response: ApolloQueryResult<PokemonQueryResult> = await fetchMore({
      variables: {
        q: value,
        limit: currentPageSize,
      },
    });

    const adaptedData: QueryAdapterData = GqlDataAdapter(response.data);
    setData(adaptedData);
  };

  const handleOnSelectSearch = (value: string) => {
    console.debug(value);
  };

  const handleLoadMore = async () => {
    const response: ApolloQueryResult<PokemonQueryResult> = await fetchMore({
      variables: {
        q: currentSearch,
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

  const filters = [...new Set(data.nodes.map(({ types }) => types.flat()).flat())].sort();

  return error ? (
    <Result
      status="warning"
      title="There were issues while retrieving the data"
    />
  ) : (
    <div>
      <Row justify="center">
        <Col span={6}>
          <Search onSearch={handleSearching} placeholder="Filter by Pokémon" style={{ width: 200 }} />
        </Col>

        <Col span={6}>
          <Select
            allowClear
            onSearch={handleOnSelectSearch}
            optionFilterProp="children"
            placeholder="Select a type"
            showSearch
          >
            {filters.map((filter: string) => <Option key={filter} value={filter}>{filter}</Option>)}
          </Select>
        </Col>

        <Col span={6}>
          <p>
            Current page size is:

            {' '}

            {currentPageSize}
          </p>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={data.dataSource}
        loading={loading}
        pagination={false}
      />

      {data.hasNextPage && <Button onClick={handleLoadMore}>Load more</Button>}
    </div>
  );
}

export default Home;
