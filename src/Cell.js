import React, { Component } from 'react';
import './App.css';

class Cell extends Component {
  constructor(props){
    super(props);

    this.stuff = this.stuff.bind(this);
  }
  shouldComponentUpdate(nextProps){
    return !(this.props.cellValue === nextProps.cellValue)
  }

  stuff(){
    this.props.colorShit(this.props.i, this.props.j);
  }

  render(){
    return (
      <div className='cell' style={{backgroundColor: this.props.cellValue}} onMouseEnter={this.stuff}></div>
    );
  }
}

export default Cell;