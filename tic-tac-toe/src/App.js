import { useState } from "react";

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isDescending, setIsDescending] = useState(true);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function sortHistory() {

    setIsDescending(!isDescending);
    moves.reverse();
  }

  let moves = history.map((move) => {
  console.log(move);
  let description;
    (move.includes("X") || move.includes("O"))
      ? (description = "Go to move #" + history.indexOf(move))
      : (description = "Go to game start");
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
        <ol>{"You are at move #" + history.length}</ol>
        
      </div>
    </div>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (squares[i] || CalculateWinner(squares)) {
      return;
    }

    const nextSquares = squares.slice();
    xIsNext ? (nextSquares[i] = "X") : (nextSquares[i] = "O");
    onPlay(nextSquares);
  }

  const winner = CalculateWinner(squares);
  let status;

  winner
    ? (status = "Winner:" + winner)
    : (status = "Next Player: " + (xIsNext ? "X" : "O"));

  function createSquare(position) {
    return (
      <Square
        key={position}
        value={squares[position]}
        onSquareClick={() => handleClick(position)}
      />
    );
  }
  function createSquares(rowNumber) {
    const squaresArr = [];
    for (let i = 0; i < 3; i++) {
      squaresArr.push(createSquare((rowNumber * 3) + i));
    }
    return squaresArr;
  }

  function createBoard() {
    const rows = [];
    for (let i = 0; i < 3; i++) {
      rows.push(<div key={i} className="board-row">{createSquares(i)}</div>);
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

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
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
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
