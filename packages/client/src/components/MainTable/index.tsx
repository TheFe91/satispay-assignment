import { Table } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';
import columns from './columns';
import { QueryAdapterData } from '../../interfaces/interfaces';
import selectors from '../../store/state/selectors';

const { getData } = selectors;

interface MainTableProps {
  pLoading: boolean;
  pbtLoading: boolean;
  tLoading: boolean;
}

function MainTable({ pLoading, pbtLoading, tLoading }: MainTableProps) {
  const { dataSource }: QueryAdapterData = useSelector(getData);

  return (
    <Table
      bordered
      columns={columns}
      dataSource={dataSource}
      loading={pLoading || pbtLoading || tLoading}
      pagination={false}
    />
  );
}

export default MainTable;
