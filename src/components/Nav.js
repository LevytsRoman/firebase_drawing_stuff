import React from 'react';
import ReactDOM from 'react-dom';
import {Link} from 'react-router-dom';
import { connect } from "react-redux";

const Nav = (props) => (
  <nav>
    <Link to='/'>home</Link> |
    <Link to='/login'>login</Link> |
    {props.currentUser ? 'logout' : <Link to='/draw'>draw</Link>}
    {props.num}
  </nav>
)

const mapStateToProps = (state) => ({
  currentUser: state.currentUser,
  num: state.lol
})

export default connect(mapStateToProps)(Nav);
