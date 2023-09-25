import "./App.css";
import Footer from "./components/Footer";
import ResultModal from "./components/ResultModal";
import Menu from "./components/Menu";
import { useState } from "react";
import {
  Game,
  GameResult,
  GameScore,
  GameState,
  Move,
  Player,
  PlayerOrNull,
} from "./types";
import { stat } from "fs";

const winningPatterns = [
  [1, 2, 3],
  [1, 5, 9],
  [1, 4, 7],
  [2, 5, 8],
  [3, 5, 7],
  [3, 6, 9],
  [4, 5, 6],
  [7, 8, 9],
];

const players: Array<Player> = [
  {
    id: 1,
    name: "Player 1",
    iconClass: "fa-o",
    colorClass: "turquoise",
  },
  {
    id: 2,
    name: "Player 2",
    iconClass: "fa-x",
    colorClass: "yellow",
  },
];

function playerSquares(moves: Move[], player: Player): Array<number> {
  return moves
    .filter((moves: Move) => moves.player.id === player.id)
    .map((move: Move) => move.squareId);
}

function hasWon(moves: Move[], player: Player): boolean {
  let playerWon: boolean = false;
  const squares: Array<number> = playerSquares(moves, player);

  winningPatterns.forEach((winningPattern: Array<number>) => {
    if (playerWon) {
      return;
    }
    const result: Array<boolean> = winningPattern.map((squareId) => {
      return squares.includes(squareId);
    });
    playerWon = result.reduce(
      (acc: boolean, currVal: boolean) => acc && currVal,
      true
    );
  });

  return playerWon;
}

function winningPlayer(moves: Move[]): PlayerOrNull {
  let winner: PlayerOrNull = null;
  players.forEach((player: Player) => {
    if (hasWon(moves, player)) {
      winner = player;
      return;
    }
  });
  return winner;
}

function howManyMovesLeft(moves: Move[]): number {
  return 9 - moves.length;
}

function currentPlayer(moves: Move[]): Player {
  return players[moves.length % 2];
}
function deriveGame(state: GameState): Game {
  const movesLeft: number = howManyMovesLeft(state.moves);
  const winner: PlayerOrNull = winningPlayer(state.moves);
  const status = winner || movesLeft === 0 ? "completed" : "in-progress";

  return {
    moves: state.moves,
    currentPlayer: currentPlayer(state.moves),
    status: {
      winner,
      movesLeft,
      status,
    },
  };
}

function deriveScore(state: GameState): GameScore {
  const gameResults: Array<GameResult> = state.gameResults;
  const player1: Player = players[0];
  const player2: Player = players[1];
  return {
    player1Wins: gameResults.filter(
      (result: GameResult) => result.winner && result.winner.id === player1.id
    ).length,
    player2Wins: gameResults.filter(
      (result: GameResult) => result.winner && result.winner.id === player2.id
    ).length,
    ties: gameResults.filter((result) => result.winner === null).length,
  };
}

export default function App() {
  const [state, setState] = useState<GameState>({
    moves: [],
    gameResults: [],
  });
  const squareIds = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  const game = deriveGame(state);

  const score = deriveScore(state);

  const resetGame = () => {
    setState((prevState) => {
      const stateClone = structuredClone(prevState);
      stateClone.gameResults = [];
      stateClone.moves = [];
      return stateClone;
    });
  };

  const restartGame = () => {
    setState((prevState) => {
      const stateClone = structuredClone(prevState);
      if (game.status.status === "completed") {
        stateClone.gameResults.push(game.status);
      }
      stateClone.moves = [];
      return stateClone;
    });
  };

  const handlePlayerMove = (squareId: number, currentPlayer: Player) => {
    setState((prevState) => {
      const stateClone = structuredClone(prevState);
      stateClone.moves.push({
        player: currentPlayer,
        squareId: squareId,
      });
      return stateClone;
    });
  };

  return (
    <>
      <main>
        <div className="grid">
          <div className="turn">
            <i className="fa-solid fa-o turquoise"></i>
            <p className="turquoise">Player 1, you're up!</p>
          </div>
          <Menu
            onAction={(action) =>
              action === "new-round" ? restartGame() : resetGame()
            }
          />

          {squareIds.map((squareId) => {
            const existingMove = game.moves.find(
              (move: Move) => move.squareId === squareId
            );
            return (
              <div
                key={squareId}
                className="square shadow"
                onClick={() => {
                  if (existingMove) return;

                  handlePlayerMove(squareId, game.currentPlayer);
                }}
              >
                {existingMove && (
                  <i
                    className={`fa-solid ${existingMove.player.iconClass} ${existingMove.player.colorClass}`}
                  ></i>
                )}
              </div>
            );
          })}
          <div className="score score--player-1 shadow">
            <p>Player 1</p>
            <span>{score.player1Wins} Wins</span>
          </div>
          <div className="score score--ties shadow">
            <p>Ties</p>
            <span>{score.ties}</span>
          </div>
          <div className="score score--player-2 shadow">
            <p>Player 2</p>
            <span>{score.player2Wins} Wins</span>
          </div>
        </div>
      </main>

      <Footer />
      {game.status.status === "completed" && (
        <ResultModal
          message={
            game.status.winner ? `${game.status.winner.name} wins!` : "Tie"
          }
          onClick={restartGame}
        />
      )}
    </>
  );
}
