import React, { Component } from "react";
import "./App.css";
import Cell from "./Cell";
import { database } from "./firebase";

function stuff(board, i, j, color, arr = []) {
  if (board[i][j] === color && compareShit(arr, [i, j])) {
    arr.push([i, j]);
  } else {
    return arr;
  }

  if (validPath(i + 1, j)) {
    stuff(board, i + 1, j, color, arr);
  }

  if (validPath(i, j + 1)) {
    stuff(board, i, j + 1, color, arr);
  }

  if (validPath(i - 1, j)) {
    stuff(board, i - 1, j, color, arr);
  }

  if (validPath(i, j - 1)) {
    stuff(board, i, j - 1, color, arr);
  }
  return arr;
  // var checked = [],
  //   succ = [];

  // while (true) {
  //   if (board[i][j] === color && compareShit(succ, [i, j])) {
  //     succ.push([i, j]);
  //   }
  //   checked.push([i, j]);
  //   if (validPath(i + 1, j) && compareShit(checked, [i + 1, j])) {
  //     i++;
  //     // stuff(board, i + 1, j, color, arr);
  //   } else if (validPath(i, j + 1) && compareShit(checked, [i, j + 1])) {
  //     // stuff(board, i, j + 1, color, arr);
  //     j++;
  //   } else if (validPath(i - 1, j) && compareShit(checked, [i - 1, j])) {
  //     // stuff(board, i - 1, j, color, arr);
  //     i--;
  //   } else if (validPath(i, j - 1) && compareShit(checked, [i, j - 1])) {
  //     j--;
  //     // stuff(board, i, j - 1, color, arr);
  //   } else {
  //     break;
  //   }
  // }
  // return succ;
}

function compareShit(arr, coord) {
  for (var i = 0, l = arr.length; i < l; i++) {
    if (arr[i][0] === coord[0] && arr[i][1] === coord[1]) {
      return false;
    }
  }
  return true;
}

function validPath(i, j) {
  return i >= 0 && i < 50 && (j >= 0 && j < 50);
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      board: [],
      usedCells: [],
      color: "#000000",
      randomColor: false,
      activeTool: "pencil",
      size: 0
    };

    this.mouseDownHandler = this.mouseDownHandler.bind(this);
    this.mouseUpHandler = this.mouseUpHandler.bind(this);
    this.mouseClicked = false;
  }

  componentDidMount() {
    database.ref("/cells").on("value", snapshot => {
        let res = snapshot.val();
        if (res) {
          // debugger

          let board = this.state.board;
          let rows = Object.keys(res);

          rows.map(rowNum => {
            Object.keys(res[rowNum]).map(colNum => {
              let cell = res[rowNum][colNum];
              // console.log(cell);
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

    var myarray = [...Array(50).keys()].map(i => Array(50).fill(null));
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

  enforceLimit(num) {
    if (num > 49) {
      return 49;
    }
    if (num < 0) {
      return 0;
    }
    return num;
  }

  shit = (i, j, k) => {
    var cells = [];
    // outer loop goes down rows
    // var row = 0;
    var p = 1;
    for (var n = 0; n <= Math.floor(k / 2); n++) {
      //has to start  at -1 of previous row
      // for(var p = 0; p < k; p++){
      while (p > 0) {
        var newCell = {
          x: this.enforceLimit(i - Math.floor(k / 2) + n),
          y: this.enforceLimit(j - n + p - 1),
          color: this.state.color
        };
        cells.push(newCell);
        p--;
      }
      p = (n + 1) * 2 + 1;
      // }
      // row++;
    }

    var h = 1;
    for (var n = 0; n < Math.floor(k / 2); n++) {
      //has to start  at -1 of previous row
      // for(var p = 0; p < k; p++){
      while (h > 0) {
        var newCell = {
          x: this.enforceLimit(i + Math.floor(k / 2) - n),
          y: this.enforceLimit(j + n - h + 1),
          color: this.state.color
        };
        cells.push(newCell);
        h--;
      }
      h = (n + 1) * 2 + 1;
      // }
      // row++;
    }
    return cells;
  };

  colorShit = (e, i, j) => {
    // console.log("colorShit fired");
    if (this.state.activeTool === "pencil") {
      console.log("I run");
      if (this.mouseClicked || e.type === "click") {
        // let board = this.state.board
        //
        // board[i][j] = this.state.color
        // this.setState({board});
        // let centerCell = {
        //   x: i,
        //   y: j,
        //   color: this.state.color
        // };
        // let cells = [centerCell];
        // console.log(typeof this.state.size);
        let cells = this.shit(i, j, this.state.size);
        // console.log(cells);
        cells.map(cell => {
          if (this.state.randomColor) {
            cell.color =
              "#" + Math.floor(Math.random() * 16777215).toString(16);
          }
          database.ref(`/cells/${cell.x}/${cell.y}`).set(cell);
        });
      }
    } else if (this.state.activeTool === "spray") {
      if (this.mouseClicked || e.type === "click") {
        // debugger;
        this.sprayStuff(i, j);
      }
    } else if (this.state.activeTool === "eraser") {
      if (
        this.state.board[i][j] &&
        this.state.board[i][j] !== "#ffffff" &&
        (this.mouseClicked || e.type === "click")
      ) {
        database.ref(`/cells/${i}/${j}/color`).set("#ffffff");
      }
    } else if (this.state.activeTool === "colorPicker") {
      if (e.type === "click") {
        this.setState({ color: this.state.board[i][j] });
      }
    } else if (this.state.activeTool === "fill" && e.type === "click") {
      let filledCells = stuff(this.state.board, i, j, this.state.board[i][j]);
      let newBoard = this.state.board;

      filledCells.map(coords => {
        // if (this.state.randomColor) {
        //   cell.color =
        //     "#" + Math.floor(Math.random() * 16777215).toString(16);
        // }
        let cell = { x: coords[0], y: coords[1], color: this.state.color };
        database.ref(`/cells/${cell.x}/${cell.y}`).set(cell);
        newBoard[cell.x][cell.y] = cell.color;
      });
      this.setState({ board: newBoard });
    }
  };

  sprayStuff = (i, j) => {
    // debugger;
    if (this.mouseClicked) {
      let cells = [];
      for (var d = 0; d < 5 * (Math.floor(this.state.size) + 1); d++) {
        let plusX = Math.round(Math.random()) > 0.5;
        let plusY = Math.round(Math.random()) > 0.5;
        let newX, newY, cellColor;
        if (plusX) {
          newX = i + Math.round(Math.random() * (5 + this.state.size));
        } else {
          newX = i - Math.round(Math.random() * (5 + this.state.size));
        }

        if (plusY) {
          newY = j + Math.round(Math.random() * (5 + this.state.size));
        } else {
          newY = j - Math.round(Math.random() * (5 + this.state.size));
        }

        if (this.state.randomColor) {
          cellColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
        } else {
          cellColor = this.state.color;
        }
        let newCell = {
          x: this.enforceLimit(newX),
          y: this.enforceLimit(newY),
          color: cellColor
        };
        cells.push(newCell);
      }
      cells.map(cell => {
        database.ref(`/cells/${cell.x}/${cell.y}`).set(cell);
      });
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

  rangeHandler = e => this.setState({ size: parseInt(e.target.value) });

  render() {
    return (
      <div className="App">
        <div className="tools">
          <h3>tools:</h3>
          <input
            type="submit"
            value="fill"
            className={this.activeTool("fill")}
            onClick={this.setTool}
          />
          <input
            type="range"
            min="1"
            max="15"
            step="2"
            value={this.state.size}
            onChange={this.rangeHandler}
          />
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
          <button
            className={this.activeTool("spray")}
            onClick={this.setTool}
            value="spray"
          >
            spray
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
