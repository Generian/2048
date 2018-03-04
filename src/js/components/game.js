import React from 'react';
import ReactDOM from 'react-dom';
import keydown from 'react-keydown';
//import '../../css/game.css';
//import Card from 'cards.jsx';


const board = {};
var free = [];
var tiles = [];

for (let i = 0; i < 16; i++) {
  board[i+1] = null;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function vecToIndex(vec) {
  let index = 4 * (vec.row - 1) + vec.col;
  return index;
}

// function printBoard() {
//   tiles = [];
//   board[randomPos()] = 2;
//   for (let i=1; i<17; i++) {
//     tiles.push(new Tile(i, board[i]));
//   };
//   // ReactDOM.render(
//   //   tiles.map(x => <Card index="6" val={x.val}/>),
//   //   document.getElementById('game-container')
//   // );
// }

// function updateBoard() {
//   tiles = [];
//   board[randomPos()] = 2;
//   for (let i=1; i<17; i++) {
//     tiles.push(new Tile(i, board[i]));
//   };
// }

class Tile {
  constructor(i, val) {
    this.index = i;
    this.val = val;
  }
}

// document.addEventListener('keypress', (event) => {
//   if (event.key === "w") {
//     //moveUp();
//     printBoard();
//   } else if (event.key === "a") {
//     //moveLeft();
//     printBoard();
//   } else if (event.key === "s") {
//     //moveDown();
//     printBoard();
//   } else if (event.key === "d") {
//     //moveRight();
//     printBoard();
//   }
// })

function indexToVec(index) {
  let pos = {};
  if (index > 0) {
    //console.log('true');
    let col = index % 4 === 0 ? 4 : index % 4;
    let row = Math.ceil(index/4.0);
    pos = {
      col: col,
      row: row
    };
  }
  return pos;
}

function arrayMove(array, from, to) {
  array.splice(to, 0, array.splice(from, 1)[0]);
};

class Card extends React.Component {

  indexToStyle(index) {
    let style = {};
    if (index > 0) {
      //console.log('true');
      let col = index % 4 === 0 ? 4 : index % 4;
      let row = Math.ceil(index/4.0);
      style = {
        gridColumnStart: col,
        gridRowStart: row
      };
    }
    return style;
  }

  render() {
    let name = "grid-item"// pos"+this.props.index;
    let s = this.indexToStyle(this.props.index);
    return (
      <div id="tile-1" className={`card ${name} ${this.props.bg ? "bg" : ""}`} style={s}>
        <h1>{this.props.val}</h1>
      </div>
    );
  }
}

for (let i=1; i<17; i++) {
  tiles.push(new Tile(i, board[i]));
};

const KEYS = [ 'w', 'a', 's', 'd']

class Game extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tiles: tiles,
      board: board,
      cards: []
    }
  }

  @keydown( KEYS )
  submit( event ) {
    this.arrangeCards(event.key);
    //this.move(event.key);
    this.add();
  }

  printBoard() {
    let t = [];
    let pos = this.randomPos();
    this.state.board[pos] = 2;
    for (let i=1; i<17; i++) {
      t.push(new Tile(i, board[i]));
    };
    //console.log(t);
    this.setState({
      tiles: t
    });
  }

  randomPos() {
    free = this.checkFree();
    let index = getRandomInt(free.length)
    return free[index];
  }

  checkFree() {
    let free = [];
    for (let i = 0; i < 16; i++) {
      if (!this.state.board[i+1]) {
        free.push(i+1);
      }
    }
    if (free.length < 1) {
      //gameOver();
    } else {
      return free;
    }
  }

  randomVal() {
    return 2;
  }

  updateIndex(oldIndex, newIndex) {
    let newCards = this.state.cards;
    for (let i = 0; i < newCards.length; i++) {
      if (newCards[i].index === oldIndex) {
        newCards[i].index = newIndex;
      }
    }
    for (let i = 0; i < 16; i++) {
      board[i+1] = null;
    }
    for (let i = 0; i < newCards.length; i++) {
      let c = newCards[i];
      board[c.index] = c.val;
    }
    this.setState({
      cards: newCards
    });
  }

  // updateVal(index) {
  //   let newCards = this.state.cards;
  //   for (let i = 0; i < newCards.length; i++) {
  //     if (newCards[i].index === oldIndex) {
  //       newCards[i].val = 2 * newCards[i].val;
  //     }
  //   }
  //   for (let i = 0; i < 16; i++) {
  //     board[i+1] = null;
  //   }
  //   for (let i = 0; i < newCards.length; i++) {
  //     let c = newCards[i];
  //     board[c.index] = c.val;
  //   }
  //   this.setState({
  //     cards: newCards
  //   });
  // }



  arrangeCards(dir) {
    let newCards = this.state.cards;
    switch (dir) {
      case 'w':
        for (let i = 1; i <= 4; i++) {
          for (let j = 0; j < newCards.length; j++) {
            if (indexToVec(newCards[j].index).row == i) {
              this.move(dir);
            }
          }
        }
        break;
      case 's':
        for (let i = 4; i > 0; i--) {
          newCards.push(this.state.cards.filter(c => indexToVec(c).row === i));
        }
        break;
      case 'a':
        for (let i = 0; i < 4; i++) {
          newCards.push(this.state.cards.filter(c => indexToVec(c).col === i + 1));
        }
        break;
      case 'd':
        for (let i = 4; i > 0; i--) {
          newCards.push(this.state.cards.filter(c => indexToVec(c).col === i));
        }
        break;
      default:
        //newCards = this.state.cards;
    }
    // for (let i = 0; i < newCards.length; i++) {
    //   console.log(newCards[i].index);
    // };
    this.setState({
      cards: newCards
    });
  }

  move(dir) {
    //this.arrangeCards(dir);
    for (let i = 0; i < this.state.cards.length; i++) {
      let cards = this.state.cards;
      let newCards = [];
      let c = cards[i];
      let pos = indexToVec(c.index);
      switch (dir) {
        case 'w':
          if (pos.row !== 1) {
            pos.row -= 1;
            let newIndex = vecToIndex(pos);
            if (this.checkIfFree(newIndex)) {
              this.updateIndex(c.index, newIndex);
            } else {
              if (this.checkIfSame(newIndex, c.val)) {
                this.updateVal(newIndex);
              }
            }
          }
          break;
        case 's':
          if (pos.row !== 4) {
            pos.row += 1;
            let newIndex = vecToIndex(pos);
            if (this.checkIfFree(newIndex)) {
              this.updateIndex(c.index, newIndex);
            } else {
              if (this.checkIfSame(newIndex, c.val)) {
                this.updateVal(newIndex);
              }
            }
          }
          break;
        case 'a':
          if (pos.col !== 1) {
            pos.col -= 1;
            let newIndex = vecToIndex(pos);
            if (this.checkIfFree(newIndex)) {
              this.updateIndex(c.index, newIndex);
            } else {
              if (this.checkIfSame(newIndex, c.val)) {
                this.updateVal(newIndex);
              }
            }
          }
          break;
        case 'd':
          if (pos.col !== 4) {
            pos.col += 1;
            let newIndex = vecToIndex(pos);
            if (this.checkIfFree(newIndex)) {
              this.updateIndex(c.index, newIndex);
            } else {
              if (this.checkIfSame(newIndex, c.val)) {
                this.updateVal(newIndex);
              }
            }
          }
          break;
        default:
      }
    }
  }

  moveUp() {
    let cards = this.state.cards;
    let newCards = [];
    for (let i = 0; i < this.state.cards.length; i++) {
      let c = cards[i];
      let pos = indexToVec(c.index);
      if (pos.row !== 1) {
        pos.row -= 1;
        let newIndex = vecToIndex(pos);
        if (this.checkIfFree(newIndex)) {
          c.index = newIndex;
          newCards.push(c);
        } else {
          if (this.checkIfSame(newIndex, c.val)) {
            this.updateVal(newIndex);
          } else {
            newCards.push(c)
          }
        }
      } else {
        newCards.push(c);
      }
    }
    for (let i = 0; i < 16; i++) {
      board[i+1] = null;
    }
    for (let i = 0; i < this.state.cards.length; i++) {
      let c = this.state.cards[i];
      board[c.index] = c.val;
    }
    this.setState({
      cards: newCards
    });
  }

  updateVal(index) {
    let target = this.state.cards.find(x => x.index === index);
    let newCards = this.state.cards
    let newVal = 2 * target.val;
    board[index] = newVal;
    for (let i = 0; i < newCards.length; i++) {
      if (newCards[i].index === index) {
        newCards[i].val = newVal;
      }
    }
    this.setState({
      cards: newCards
    });
  }

  checkIfSame(index, val) {
    let target = this.state.cards.find(x => x.index === index)
    return target.val === val ? true : false;
  }

  checkIfFree(index) {
    let result = true;
    for (let i = 0; i < this.state.cards.length; i++) {
      let indexToCheck = this.state.cards[i].index;
      if (indexToCheck === index) {
        result = false;
      }
    }
    return result;
  }

  add() {
    let c = this.state.cards;
    let pos = this.randomPos();
    this.state.board[pos] = 2;
    //console.log(indexToVec(pos));
    c.push(new Tile(pos, this.randomVal()));
    this.setState({
      cards: c
    });
    //console.log(this.state.cards);
  }




  render() {
    //console.log("board:",this.state.board);
    let cards = this.state.cards.map(x => <Card val={x.val} index={x.index} />)
    return (
      <div className='game-container'>
        {back}
        {cards}
      </div>
    );
  }
}

// ========================================

//console.log(board);
var back = [];
for (let i = 0; i < 16; i++) {
  back.push(<Card index={i+1} bg={true}/>);
}


ReactDOM.render(
  <Game />,
  document.getElementById('container')
);

// ReactDOM.render(
//   tiles.map(x => <Card index="6" text={x.text}/>),
//   document.getElementById('game-container')
// );
