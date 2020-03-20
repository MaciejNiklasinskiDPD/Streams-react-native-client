/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Provider } from 'react-redux';
import reducers from './reducers';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import LogInScreen from './screens/LogInScreen';
import StreamsIndexScreen from './screens/StreamsIndexScreen';
import ShowStreamScreen from './screens/ShowStreamScreen';
import ShowStreamIOSScreen from './screens/ShowStreamIOSScreen';
import CreateStreamScreen from './screens/CreateStreamScreen';
import EditStreamScreen from './screens/EditStreamScreen';

import Header from './components/Header';

const stackNavigator = createStackNavigator({
  LogIn: LogInScreen,
  StreamsIndex: StreamsIndexScreen,
  ShowStream: Platform.OS === 'ios' ? ShowStreamIOSScreen : ShowStreamScreen,
  CreateStream: CreateStreamScreen,
  EditStream: EditStreamScreen,
},
  {
    initialRouteName: 'LogIn',
    defaultNavigationOptions: {
      header: () => {
        return <Header />
      }
    },
  });

const AppContainer = createAppContainer(stackNavigator);

export const store = createStore(reducers, compose(applyMiddleware(thunk)));

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Provider
        store={store}>
        <AppContainer />
      </Provider >
    );
  }
}