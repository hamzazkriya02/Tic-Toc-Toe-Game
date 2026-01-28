import { useState } from 'react';
import './App.css';

function Square({ value, onClick, isWinning }) {
  return (
    <button
      className={`square ${isWinning ? 'win' : ''}`}
      onClick={onClick}
      style={{ color: value === 'X' ? '#2563eb' : '#dc2626' }}
    >
      {value}
    </button>
  );
}

function Board({ squares, xIsNext, onPlay }) {
  const result = calculateWinner(squares);
  const winningLine = result?.line || [];

  function handleClick(i) {
    if (result || squares[i]) return;
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  }

  return (
    <div>
      {[0, 3, 6].map(row => (
        <div className="board-row" key={row}>
          {[0, 1, 2].map(col => {
            const index = row + col;
            return (
              <Square
                key={index}
                value={squares[index]}
                onClick={() => handleClick(index)}
                isWinning={winningLine.includes(index)}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);

  const currentSquares = history[currentMove];
  const xIsNext = currentMove % 2 === 0;
  const result = calculateWinner(currentSquares);

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function restartGame() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  let status;
  if (result) status = `Winner: ${result.winner}`;
  else if (currentSquares.every(Boolean)) status = 'Match Draw';
  else status = `Next Player: ${xIsNext ? 'X' : 'O'}`;

  return (
    <div className="game">
      <h1 className="title">Tic Tac Toe Game</h1>

      <Board
        squares={currentSquares}
        xIsNext={xIsNext}
        onPlay={handlePlay}
      />

      <div className="result">{status}</div>

      <button className="restart" onClick={restartGame}>
        Restart Game
      </button>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let line of lines) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line };
    }
  }
  return null;
}