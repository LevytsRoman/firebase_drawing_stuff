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
      activeTool: "pencil",
      size: 0
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
    // console.log("colorShit fired");
    if (this.state.activeTool === "pencil") {
      if (this.mouseClicked || e.type === "click") {
        // let board = this.state.board
        //
        // board[i][j] = this.state.color
        // this.setState({board});
        let centerCell = {
          x: i,
          y: j,
          color: this.state.color
        };
        let cells = [centerCell];
        // console.log(typeof this.state.size);
        if (this.state.size !== 0) {
          for (var k = 0; k <= this.state.size; k++) {
            let xPlusCell = {
              x: i + k,
              y: j,
              color: this.state.color
            };
            let xMinusCell = {
              x: i - k,
              y: j,
              color: this.state.color
            };
            let yPlusCell = {
              x: i,
              y: j + k,
              color: this.state.color
            };
            let yMinusCell = {
              x: i,
              y: j - k,
              color: this.state.color
            };
            let xyPlusCell = {
              x: i + k - 1,
              y: j + k - 1,
              color: this.state.color
            };
            let xyMinusCell = {
              x: i - k + 1,
              y: j - k + 1,
              color: this.state.color
            };
            let yPlusxMinusCell = {
              x: i - k + 1,
              y: j + k - 1,
              color: this.state.color
            };
            let yMinusxPlusCell = {
              x: i + k - 1,
              y: j - k + 1,
              color: this.state.color
            };

            cells = cells.concat([
              xPlusCell,
              xMinusCell,
              yPlusCell,
              yMinusCell,
              xyMinusCell,
              xyPlusCell,
              yPlusxMinusCell,
              yMinusxPlusCell
            ]);
          }
        }
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
        let cells = [];
        for (var d = 0; d < 10; d++) {
          let plusX = Math.round(Math.random()) > 0.5;
          let plusY = Math.round(Math.random()) > 0.5;
          let newX, newY, cellColor;
          if (plusX) {
            newX = i + Math.round(Math.random() * 5);
          } else {
            newX = i - Math.round(Math.random() * 5);
          }

          if (plusY) {
            newY = j + Math.round(Math.random() * 5);
          } else {
            newY = j - Math.round(Math.random() * 5);
          }

          if (this.state.randomColor) {
            cellColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
          } else {
            cellColor = this.state.color;
          }
          let newCell = {
            x: newX,
            y: newY,
            color: cellColor
          };
          cells.push(newCell);
        }
        cells.map(cell => {
          database.ref(`/cells/${cell.x}/${cell.y}`).set(cell);
        });
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
            type="range"
            min="0"
            max="2"
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
