import React, { Component } from "react";
import "./App.css";
import Cell from "./Cell";
import { database } from "./firebase";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      board: [],
      usedCells: [],
      color: "#000000",
      randomColor: false,
      activeTool: "pencil"
    };
    this.mouseDownHandler = this.mouseDownHandler.bind(this);
    this.mouseUpHandler = this.mouseUpHandler.bind(this);
    this.mouseClicked = false;
  }

  componentDidMount() {
    database.ref("/cells").on(
      "value",
      snapshot => {
        let res = snapshot.val();
        if (res) {
          // debugger

          let board = this.state.board;
          let rows = Object.keys(res);
          rows.map(rowNum => {
            Object.keys(res[rowNum]).map(colNum => {
              let cell = res[rowNum][colNum];
              console.log(cell);
              board[parseInt(cell.x)][parseInt(cell.y)] = cell.color;
            });
          });
          this.setState({ board });
        }
      },
      function(errorObject) {
        console.log("The read failed: " + errorObject.code);
      }
    );

    var myarray = [...Array(100).keys()].map(i => Array(100).fill(null));
    this.setState({ board: myarray });
    // debugger
    // database.ref('/board').set(myarray)
  }

  componentWillUnmount() {
    database.ref("/cells").off();
  }

  handleChange(e) {
    // this.setState({
    //   newMessage: e.target.value
    // })
  }

  colorShit = (e, i, j) => {
    console.log("colorShit fired");
    if (this.state.activeTool === "pencil") {
      if (this.mouseClicked) {
        // let board = this.state.board
        //
        // board[i][j] = this.state.color
        // this.setState({board});
        let cell = {
          x: i,
          y: j,
          color: this.state.color
        };
        if (this.state.randomColor) {
          cell.color = "#" + Math.floor(Math.random() * 16777215).toString(16);
        }
        database.ref(`/cells/${i}/${j}`).set(cell);
      }
    } else if (this.state.activeTool === "eraser") {
      if (
        this.state.board[i][j] &&
        this.state.board[i][j] !== "#ffffff" &&
        this.mouseClicked
      ) {
        database.ref(`/cells/${i}/${j}/color`).set("#ffffff");
      }
    } else if (this.state.activeTool === "colorPicker") {
      if (e.type === "click") {
        this.setState({ color: this.state.board[i][j] });
      }
    }
  };
  mouseDownHandler() {
    this.mouseClicked = true;
  }

  mouseUpHandler() {
    this.mouseClicked = false;
  }
  addMessage() {
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
    var myarray = [...Array(100).keys()].map(i => Array(100).fill(null));
    this.setState({ board: myarray });
    // database.ref('/board').set(myarray)
    database.ref("/cells").set(null);
  };

  setTool = e => {
    this.setState({ activeTool: e.target.value });
  };

  activeTool = toolName =>
    toolName === this.state.activeTool ? "active" : null;

  render() {
    return (
      <div className="App">
        <div className="tools">
          <h3>tools:</h3>
          <button
            className={this.state.randomColor ? "active" : ""}
            onClick={() => {
              this.setState({ randomColor: !this.state.randomColor });
            }}
          >
            random color mode
          </button>
          <button
            className={this.activeTool("colorPicker")}
            onClick={this.setTool}
            value="colorPicker"
          >
            color picker
          </button>
          <button
            className={this.activeTool("eraser")}
            onClick={this.setTool}
            value="eraser"
          >
            eraser
          </button>
          <button
            className={this.activeTool("pencil")}
            onClick={this.setTool}
            value="pencil"
          >
            pencil
          </button>
          <button onClick={this.resetColors}>reset</button>
          <input
            type="color"
            value={this.state.color}
            onChange={e => this.setState({ color: e.target.value })}
          />
        </div>
        <div
          className={"board " + this.state.activeTool}
          onMouseDown={this.mouseDownHandler}
          onMouseLeave={this.mouseUpHandler}
          onMouseUp={this.mouseUpHandler}
        >
          {this.state.board.map((row, i) => {
            return row.map((cell, j) => (
              <Cell
                colorShit={this.colorShit}
                cellValue={cell}
                i={i}
                j={j}
                key={i.toString() + j.toString()}
              />
            ));
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
