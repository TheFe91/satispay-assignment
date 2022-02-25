import React from 'react';
import { Provider } from 'react-redux';
import './App.css';

import Home from './components/home';
import { store } from './store/configureStore';

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Home />
      </div>
    </Provider>
  );
}

export default App;
