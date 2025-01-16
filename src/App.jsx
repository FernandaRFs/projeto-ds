import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true); // Jogador começa com X
  const [winner, setWinner] = useState(null);

  // Função para renderizar a célula
  const renderCell = (index) => {
    return (
      <button className="cell" onClick={() => handleClick(index)}>
        {board[index]}
      </button>
    );
  };

  // Função para manipular o clique nas células
  const handleClick = (index) => {
    if (board[index] || winner) return; // Não faz nada se a célula estiver ocupada ou se já houver vencedor

    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext); // Alterna entre jogador (X) e máquina (O)

    const newWinner = calculateWinner(newBoard);
    if (newWinner) {
      setWinner(newWinner);
    }
  };

  // Função para calcular o vencedor
  const calculateWinner = (board) => {
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

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a]; // Retorna X ou O
      }
    }
    return null;
  };

  // Função para reiniciar o jogo
  const restartGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true); // Jogador começa com X
    setWinner(null);
  };

  // Função Minimax para calcular a melhor jogada
  const minimax = (board, depth, isMaximizing, maxDepth) => {
    const winner = calculateWinner(board);
    if (winner === 'O') return 10 - depth; // A máquina vence
    if (winner === 'X') return depth - 10; // O jogador vence
    if (board.every(cell => cell !== null) || depth === maxDepth) return 0; // Empate ou atingiu a profundidade máxima

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (board[i] === null) {
          board[i] = 'O';
          const score = minimax(board, depth + 1, false, maxDepth);
          board[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
        if (board[i] === null) {
          board[i] = 'X';
          const score = minimax(board, depth + 1, true, maxDepth);
          board[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  };

  // Função para calcular a melhor jogada para a IA
  const getBestMove = (board, maxDepth) => {
    let bestMove = -1;
    let bestScore = -Infinity;

    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = 'O';
        const score = minimax(board, 0, false, maxDepth);
        board[i] = null;
        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }

    return bestMove;
  };

  // Função para fazer a jogada da IA
  const makeMoveAI = () => {
    const maxDepth = 2; // Limita a profundidade da análise (quanto maior, mais difícil)
    const bestMove = getBestMove(board, maxDepth);
    const newBoard = [...board];
    newBoard[bestMove] = 'O';
    setBoard(newBoard);
    setIsXNext(true); // Depois que a IA joga, é a vez do jogador

    const newWinner = calculateWinner(newBoard);
    if (newWinner) {
      setWinner(newWinner);
    }
  };

  // Detecta quando é a vez da IA e faz a jogada automaticamente
  useEffect(() => {
    if (!isXNext && !winner) { // Se for a vez da máquina e não houver vencedor
      const timer = setTimeout(() => {
        makeMoveAI();
      }, 500); // A máquina faz a jogada com um pequeno delay (500ms)
      return () => clearTimeout(timer);
    }
  }, [isXNext, board, winner]); // Roda sempre que isXNext, board ou winner mudarem

  return (
    <div className="game">
      <h1>Jogo da Velha</h1>
      <div className="board">
        {board.map((_, index) => renderCell(index))}
      </div>
      <div className="info">
        {winner ? (
          <h2>Vencedor: {winner}</h2>
        ) : (
          <h2>Próxima jogada: {isXNext ? 'Jogador (X)' : 'Máquina (O)'}</h2>
        )}
        <button onClick={restartGame}>Reiniciar Jogo</button>
      </div>
    </div>
  );
};

export default App;
