import { useState } from "react";

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isDescending, setIsDescending] = useState(true);
  const [positionHist, setPositionHist] = useState([Array(9).fill(null)]); // Save each new position in an array and call later based on move number?
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares, position) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    const nextPosition = [...positionHist.slice(0, currentMove + 1), findPosition(position)];
    setHistory(nextHistory);
    setPositionHist(nextPosition)
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function sortHistory() {

    setIsDescending(!isDescending);
    moves.reverse();
  }

  function findPosition(position){
    let columnRowValue = ""

    if (position === 0) {
      columnRowValue = "(1, 1)"
    } else if (position === 1){
      columnRowValue = "(1, 2)"
    } else if (position === 2){
      columnRowValue = "(1, 3)"
    }else if (position === 3){
      columnRowValue = "(2, 1)"
    }else if (position === 4){
      columnRowValue = "(2, 2)"
    }else if (position === 5){
      columnRowValue = "(2, 3)"
    }else if (position === 6){
      columnRowValue = "(3, 1)"
    }else if (position === 7){
      columnRowValue = "(3, 2)"
    }else if (position === 8){
      columnRowValue = "(3, 3)"
    }else {
      columnRowValue = "( , )"
    }
    return columnRowValue;
  }

  let moves = history.map((move) => {

  let description;
    if (move.includes("X") || move.includes("O")){
      let columnRowValue = positionHist[history.indexOf(move)] 
      description = "Go to move #" + history.indexOf(move) + " " + columnRowValue 
    }else{
      description = "Go to game start"
    }
    return (
      <div>
        <li key={move}>
          <button onClick={() => jumpTo(history.indexOf(move))}>{description}</button>
        </li>
      </div>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button onClick={() => sortHistory()}>
          Sort by: {isDescending ? "Descending" : "Asending"}
        </button>
        <ol>{isDescending ? moves : moves.reverse()}</ol>
        <ol>{"You are at move #" + (history.length)}</ol>
        
      </div>
    </div>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {

    if (squares[i] || CalculateWinner(squares)[0].length > 0) {
      return;
    }

    const nextSquares = squares.slice();
    xIsNext ? (nextSquares[i] = "X") : (nextSquares[i] = "O");
    onPlay(nextSquares, i);
  }

  const winner = CalculateWinner(squares);

  let status;

  if (winner[0].length > 0) {
    status = "Winner:" + winner[0]
  } else if (squares.includes(null)){
    status = "Next Player: " + (xIsNext ? "X" : "O")
  }else{
    status = "Draw"
  }

  function createSquare(position) {
    return (
      <Square
        key={position}
        value={squares[position]}
        onSquareClick={() => handleClick(position)}
        cssClass = {winner[1].includes(position) ? "winning-square" : "square"}
      />
    );
  }
  function createRow(rowNumber) {
    const squaresArr = [];
    for (let i = 0; i < 3; i++) {
      squaresArr.push(createSquare((rowNumber * 3) + i));
    }
    return squaresArr;
  }

  function createBoard() {
    const rows = [];
    for (let i = 0; i < 3; i++) {
      rows.push(<div key={i} className="board-row">{createRow(i)}</div>);
    }
    return rows;
  }
  return (
    <>
      <div className="status">{status}</div>
      {createBoard()}
    </>
  );
}

function Square({ value, onSquareClick, cssClass}) {
  return (
    <button className={cssClass} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function CalculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {;
      return [squares[a], lines[i]];
    }

  }
  return ["", []];
}
