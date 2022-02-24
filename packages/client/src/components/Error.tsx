import { Result } from 'antd';
import React from 'react';

function Error() {
  return (
    <Result
      status="warning"
      title="There were issues while retrieving the data"
    />
  );
}

export default Error;
