import { Result } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';
import selectors from '@State/selectors';

const { getDataError } = selectors;

function Error() {
  const dataError = useSelector(getDataError);

  return (
    <Result
      status="error"
      title={(
        <>
          There were issues while retrieving the data
          <br />
          Please reload the page and try again

          <br />

          Error is:
          {' '}

          {dataError && dataError.message}
        </>
      )}
    />
  );
}

export default Error;
