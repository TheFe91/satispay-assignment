import React, { useState } from 'react';
import { Input, Table } from 'antd';

const { Search } = Input;

const originalDataSource = [
  {
    key: '1',
    name: 'Mike',
    type: 'Man',
    classification: '10 Downing Street',
  },
  {
    key: '2',
    name: 'Margareth',
    type: 'Woman',
    classification: '10 Downing Street',
  },
  {
    key: '3',
    name: 'Ginny',
    type: 'Woman',
    classification: 'Milano',
  },
];

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

function Home() {
  const [dataSource, setDataSource] = useState(originalDataSource);

  const handleSearching = (value: string) => {
    const newDataSource = dataSource.filter(({ name }) => name.toLowerCase().includes(value));
    setDataSource(value ? newDataSource : originalDataSource);
  };

  return (
    <div>
      <Search onSearch={handleSearching} placeholder="Filter by Pokémon" style={{ width: 200 }} />
      <Table columns={columns} dataSource={dataSource} />
    </div>
  );
}

export default Home;
