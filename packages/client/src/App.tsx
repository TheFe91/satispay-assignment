import React from 'react';
import { Provider } from 'react-redux';

import Home from './components/Home';
import { store } from './store/configureStore';

function App() {
  return (
    <Provider store={store}>
      <Home />
    </Provider>
  );
}

export default App;
