/* eslint-disable import/default */

import React, {Component} from 'react';
import {render} from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import { ReactTableDefaults } from 'react-table';
import routes from './routes';
import configureStore from './store/configureStore';
import 'bootstrap/dist/css/bootstrap.css';
import toastr from 'toastr';
import 'toastr/build/toastr.css';
import './styles/main.scss';
import $ from 'jquery';

import { syncHistoryWithStore } from 'react-router-redux';

const store = configureStore();

class NextIcon extends Component {
  render() {
    return <button className="-nexticon" {...this.props}><img src="../assets/scroll-arrow-right.svg"/></button>;
  }
}

class PrevIcon extends Component {
  render() {
    return <button className="-previcon"{...this.props}><img src="../assets/scroll-arrow-left.svg"/></button>;
  }
}

$( document ).ajaxError(function( event, request, settings ) {
  console.log(event, request, settings);
  toastr.error("There was a server error", "Error");
});

// React table defaults

Object.assign(ReactTableDefaults, {
  PreviousComponent: PrevIcon,
  NextComponent: NextIcon
});

// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(browserHistory, store);
const html_root = document.getElementById('app');
render(
  <Provider store={store}>
    <Router history={history} routes={routes} />
  </Provider>, html_root
);
