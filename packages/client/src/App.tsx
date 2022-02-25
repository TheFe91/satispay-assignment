import React from 'react';
import { Provider } from 'react-redux';

import Home from '@Components/Home';
import { store } from '@Store/configureStore';

function App() {
  return (
    <Provider store={store}>
      <Home />
    </Provider>
  );
}

export default App;
