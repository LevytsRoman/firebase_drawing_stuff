import React from 'react';
import { Route, BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

import Login from '../pages/Login';
import Home from '../pages/Home';
import DrawingBoard from '../pages/DrawingBoard';
import Nav from './Nav';
import store from "../store";

export default () => (
  <BrowserRouter>
    <Provider store={store}>
      <div className="app">
        <Nav/>
        <Route exact path="/" component={Home} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/draw" component={DrawingBoard} />
      </div>
    </Provider>
  </BrowserRouter>
)
