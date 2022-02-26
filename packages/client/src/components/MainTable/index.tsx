import { Table } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';

import { QueryAdapterData } from '@Interfaces/interfaces';
import selectors from '@State/selectors';
import columns from './columns';

const { getData, getIsFetchingData } = selectors;

function MainTable() {
  const { dataSource }: QueryAdapterData = useSelector(getData);
  const isFetchingData = useSelector(getIsFetchingData);

  return (
    <Table
      bordered
      columns={columns}
      dataSource={dataSource}
      loading={isFetchingData}
      pagination={false}
    />
  );
}

export default MainTable;
