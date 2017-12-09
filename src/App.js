import React, { Component } from 'react';
import './App.css';
import Cell from './Cell'
import { database } from './firebase';

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      // messages: {},
      // newMessage: ""
      // player:
      board: [],
      color: ''
    }
  }

  componentDidMount() {

    database.ref().on("value", snapshot => {
      let board = snapshot.val().board;
      // console.log('lol')
      this.setState({board});
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });

    // var myarray = [...Array(100).keys()].map(i => Array(100).fill(0));
    // this.setState({board: myarray});
    // debugger
    // database.ref('/board').set(myarray)
  }

  // componentWillUnmount(){
  //   .ref.off();
  // }

  handleChange(e){
    // this.setState({
    //   newMessage: e.target.value
    // })
  }

  colorShit = (i,j) => {
    // let board = this.state.board
    //
    // board[i][j] = this.state.color
    // this.setState({board});
    // debugger
    database.ref(`/board/${i}/${j}`).set(this.state.color);
  }

  addMessage(){
    // e.preventDefault(); // <- prevent form submit from reloading the page
    /* Send the message to Firebase */
    // let newMessage = {message: this.state.newMessage};
    // database.ref('messages').push(newMessage);
    // this.setState({newMessage: ''});
    // this.inputEl.value = ''; // <- clear the input
  }

  // onSubmit(){
  //   fire.database().ref('messages').push
  // }

  resetColors = () => {
    var myarray = [...Array(100).keys()].map(i => Array(100).fill('white'));
    database.ref('/board').set(myarray)
  }

  render() {
    return (
      <div className="App">
        <h1>Crap</h1>
        <button onClick={this.resetColors}>reset</button>
        <input type='color' onChange={(e) => this.setState({color: e.target.value})}/>
        <div className="board">
          {this.state.board.map( (row,i) => {
            return row.map( (cell,j) => <Cell colorShit={this.colorShit} cellValue={cell} i={i} j={j} key={i.toString() + j.toString()}/>)
          })}
        </div>
      </div>
    );
  }
}

export default App;
// {Object.values(this.state.messages).map( (m,i) => <div key={i}>{m.message}</div> )}
// <input type="text" onChange={this.handleChange.bind(this)} value={this.state.newMessage}/>
// <button onClick={this.addMessage.bind(this)}>submit</button>
