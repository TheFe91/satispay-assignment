import React, { useEffect, useState } from 'react';
import { Input, Result, Table } from 'antd';
import { useQuery } from '@apollo/client';
import GqlDataAdapter from '../helpers/gql_data_adapter';
import { PokemonDataSource } from '../interfaces/pokemonByType';
import queries from '../helpers/queries';

const { Search } = Input;

function Home() {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      filters: [
        {
          text: 'Man',
          value: 'Man',
        },
        {
          text: 'Woman',
          value: 'Woman',
        },
      ],
      onFilter: (value: any, record: { type: string | any[] }) => record.type.indexOf(value) === 0,
    },
    {
      title: 'Classification',
      dataIndex: 'classification',
      key: 'classification',
    },
  ];

  const [dataSource, setDataSource] = useState<PokemonDataSource[]>([]);
  const { loading, error, data } = useQuery(queries.POKEMONS);

  useEffect(() => {
    if (data) {
      setDataSource(GqlDataAdapter(data).nodes);
    }
  }, [data]);

  const handleSearching = (value: string) => {
    const newDataSource = dataSource.filter(({ name }) => name.toLowerCase().includes(value.toLowerCase()));
    setDataSource(value ? newDataSource : GqlDataAdapter(data).nodes);
  };

  return error ? (
    <Result
      status="warning"
      title="There were issues while retrieving the data"
    />
  ) : (
    <div>
      <Search onSearch={handleSearching} placeholder="Filter by Pokémon" style={{ width: 200 }} />
      <Table
        columns={columns}
        dataSource={dataSource}
        loading={loading}
      />
    </div>
  );
}

export default Home;
