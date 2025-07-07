import { useState, useEffect } from 'react'
import './App.css'

const GAME_PHASES = {
  PLACEMENT: 'placement',
  MOVEMENT: 'movement',
  GAME_OVER: 'game_over'
}

const PLAYERS = {
  X: 'X',
  O: 'O'
}

let xWins = 0;
let oWins = 0;

function App() {
  const [board, setBoard] = useState(Array(9).fill(null))
  const [currentPlayer, setCurrentPlayer] = useState(PLAYERS.X)
  const [gamePhase, setGamePhase] = useState(GAME_PHASES.PLACEMENT)
  const [placedPieces, setPlacedPieces] = useState({ X: 0, O: 0 })
  const [selectedSquare, setSelectedSquare] = useState(null)
  const [winner, setWinner] = useState(null)
  const [timeLeft, setTimeLeft] = useState(180) // 3 minutes
  const [gameStarted, setGameStarted] = useState(false)

  // Timer effect
  useEffect(() => {
    if (!gameStarted || winner) return
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setWinner('Draw')
          setGamePhase(GAME_PHASES.GAME_OVER)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [gameStarted, winner])

  // Check for winner
  const checkWinner = (board) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ]
    
    for (let line of lines) {
      const [a, b, c] = line
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a]
      }
    }
    return null
  }

  // Valid moves for movement phase
  const getValidMoves = (fromIndex) => {
    const validMoves = []
    const adjacentSquares = {
      0: [1, 3],
      1: [0, 2, 4],
      2: [1, 5],
      3: [0, 4, 6],
      4: [1, 3, 5, 7], // center can connect to all orthogonal
      5: [2, 4, 8],
      6: [3, 7],
      7: [4, 6, 8],
      8: [5, 7]
    }

    // Special rules for center (index 4)
    if (fromIndex === 4) {
      // From center, can move to any unoccupied junction
      for (let i = 0; i < 9; i++) {
        if (i !== 4 && !board[i]) {
          validMoves.push(i)
        }
      }
    } else {
      // Normal orthogonal movement + can move to center if unoccupied
      adjacentSquares[fromIndex].forEach(index => {
        if (!board[index]) {
          validMoves.push(index)
        }
      })
      // Can always move to center if it's unoccupied
      if (!board[4] && fromIndex !== 4) {
        validMoves.push(4)
      }
    }

    return validMoves
  }

  const handleSquareClick = (index) => {
    if (winner) return

    if (!gameStarted) {
      setGameStarted(true)
    }

    if (gamePhase === GAME_PHASES.PLACEMENT) {
      // Placement phase
      if (board[index]) return // Square already occupied
      
      const newBoard = [...board]
      newBoard[index] = currentPlayer
      setBoard(newBoard)
      
      const newPlacedPieces = { ...placedPieces }
      newPlacedPieces[currentPlayer]++
      setPlacedPieces(newPlacedPieces)
      
      // Check for winner
      const gameWinner = checkWinner(newBoard)
      if (gameWinner) {
        console.log(gameWinner);
        if (gameWinner == "X") {
          xWins += 1;
        }
        if (gameWinner == "O") {
          oWins += 1;
        }
        setWinner(gameWinner)
        setGamePhase(GAME_PHASES.GAME_OVER)
        return
      }
      
      // Switch to movement phase if both players placed 3 pieces
      if (newPlacedPieces.X === 3 && newPlacedPieces.O === 3) {
        setGamePhase(GAME_PHASES.MOVEMENT)
      }
      
      setCurrentPlayer(currentPlayer === PLAYERS.X ? PLAYERS.O : PLAYERS.X)
    } else if (gamePhase === GAME_PHASES.MOVEMENT) {
      // Movement phase
      if (selectedSquare === null) {
        // Select a piece to move
        if (board[index] === currentPlayer) {
          setSelectedSquare(index)
        }
      } else {
        if (index === selectedSquare) {
          // Deselect
          setSelectedSquare(null)
        } else if (board[index] === currentPlayer) {
          // Select different piece
          setSelectedSquare(index)
        } else if (!board[index]) {
          // Try to move to empty square
          const validMoves = getValidMoves(selectedSquare)
          if (validMoves.includes(index)) {
            const newBoard = [...board]
            newBoard[selectedSquare] = null
            newBoard[index] = currentPlayer
            setBoard(newBoard)
            setSelectedSquare(null)
            
            // Check for winner
            const gameWinner = checkWinner(newBoard)
            if (gameWinner) {
              console.log(gameWinner);
              if (gameWinner == "X") {
                xWins += 1;
              }
              if (gameWinner == "O") {
                oWins += 1;
              }
              setWinner(gameWinner)
              setGamePhase(GAME_PHASES.GAME_OVER)
              return
            }
            
            setCurrentPlayer(currentPlayer === PLAYERS.X ? PLAYERS.O : PLAYERS.X)
          }
        }
      }
    }
  }
  const resetCounts = () => {
    setBoard(Array(9).fill(null))
    setCurrentPlayer(PLAYERS.X)
    setGamePhase(GAME_PHASES.PLACEMENT)
    setPlacedPieces({ X: 0, O: 0 })
    setSelectedSquare(null)
    setWinner(null)
    setTimeLeft(180)
    setGameStarted(false)
    xWins = 0;
    oWins = 0;
  }

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setCurrentPlayer(PLAYERS.X)
    setGamePhase(GAME_PHASES.PLACEMENT)
    setPlacedPieces({ X: 0, O: 0 })
    setSelectedSquare(null)
    setWinner(null)
    setTimeLeft(180)
    setGameStarted(false)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getSquareClass = (index) => {
    let className = 'square'
    if (board[index] === 'X') {
      className += ' player-x'
    } else if (board[index] === 'O') {
      className += ' player-o'
    }
    if (selectedSquare === index) {
      className += ' selected'
    }
    if (gamePhase === GAME_PHASES.MOVEMENT && selectedSquare !== null) {
      const validMoves = getValidMoves(selectedSquare)
      if (validMoves.includes(index) && !board[index]) {
        className += ' valid-move'
      }
    }
    return className
  }

  return (
    <div className="App">
      <h1>Moving Tic-Tac-Toe</h1>
      <div className="game-info">
        <div className="status">
          {winner ? (
            winner === 'Draw' ? "Game Draw!" : `Winner: ${winner}`
          ) : (
            `Current Player: ${currentPlayer} | Phase: ${gamePhase === GAME_PHASES.PLACEMENT ? 'Placement' : 'Movement'}`
          )}
        </div>
        <div className="timer">Time: {formatTime(timeLeft)}</div>
        <div className="pieces-info">
          Player X: {placedPieces.X}/3 pieces | Player O: {placedPieces.O}/3 pieces
        </div>
      </div>
      
      <div className="board-data">
        <div className="board">
          {board.map((value, index) => (
            <button
              key={index}
              className={getSquareClass(index)}
              onClick={() => handleSquareClick(index)}
            >
              {value}
            </button>
          ))}
        </div> 
        <div id="control-box">
          <div className="win-counter">
            <p>X has won {xWins} times</p>
            <p>O has won {oWins} times</p>
          </div>
          <div className="game-controls">
            <button onClick={resetGame}>New Game</button>
            <br></br>
            <br></br>
            <button onClick={resetCounts}>Reset Game and Counts</button>
          </div>
        </div>     
      </div>

      <div className="rules">
        <h3>Rules:</h3>
        <ul>
          <li>Each player places 3 pieces alternately</li>
          <li>Then move pieces orthogonally to adjacent squares</li>
          <li>Can move to center from any position if unoccupied</li>
          <li>From center, can move to any unoccupied position</li>
          <li>First to get 3 in a row wins</li>
          <li>Game draws after 3 minutes</li>
        </ul>
      </div>
    </div>
  )
}

export default App