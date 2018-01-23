import React from 'react';
import { Route, BrowserRouter } from "react-router-dom";
import Login from './components/users/login';
import Home from './Home';
import DrawingBoard from './DrawingBoard';
import Nav from './Nav';

export default () => (
  <BrowserRouter>
    <div className="app">
      <Nav/>  
      <Route exact path="/" component={Home} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/draw" component={DrawingBoard} />
    </div>
  </BrowserRouter>
)
