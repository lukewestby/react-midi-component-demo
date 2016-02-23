import React from 'react';
import { render } from 'react-dom';
import { createStore, compose } from 'redux';
import { connect } from 'react-redux';
import { install } from 'redux-loop';
import view from './view';
import { reducer } from './update';
import init from './model';

const App = connect((model) => ({ model }))(view);

const store = createStore(reducer, init(), compose(
  install(),
  window.devToolsExtension ? window.devToolsExtension() : undefined
));

render(
  <App store={store} />,
  document.querySelector('main')
);
