import React from 'react';
import ReactDOM from 'react-dom';
import {Link} from 'react-router-dom'

export default () => (
  <nav>
    <Link to='/'>home</Link> |
    <Link to='/login'>login</Link> |
    <Link to='/draw'>draw</Link>
  </nav>
)
