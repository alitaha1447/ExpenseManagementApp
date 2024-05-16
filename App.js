import React from 'react';
import HomeScreen from './src/screens/HomeScreen';
import { Provider } from 'react-redux';
import store from './src/redux/store/Index';

function App() {

  return (
    <Provider store={store}>
      <HomeScreen />
    </Provider>
  );
}


export default App;
