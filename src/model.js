const initialState = { moves: [], ties: 0 };
const MAX_MOVES = 9;

export default class Model {
  #state = initialState;
  #winningPatterns = [
    [1, 2, 3],
    [1, 5, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 5, 7],
    [3, 6, 9],
    [4, 5, 6],
    [7, 8, 9],
  ];

  constructor(players) {
    this.players = players;
  }

  get currentPlayer() {
    const state = this.#getState();

    return this.players[state.moves.length % 2];
  }

  get movesLeft() {
    return MAX_MOVES - this.#getState().moves.length;
  }

  get score() {
    const state = this.#getState();
    return {
      scores: this.players.map((player) => {
        return { playerId: player.id, wins: player.wins };
      }),
      ties: state.ties,
    };
  }

  restartGame() {
    this.#setState((state) => {
      state.moves = [];
      return state;
    });
  }

  resetGame(players) {
    this.players = players;
    this.restartGame();
  }

  isSquareTaken(squareId) {
    const existingMove = this.#getState().moves.find((move) => {
      return move.squareId === squareId;
    });

    return existingMove !== undefined;
  }

  makeMove(squareId) {
    const currentPlayer = this.currentPlayer;

    this.#addMove(squareId);

    const hasWon = this.#hasWon(currentPlayer);
    const movesLeft = this.movesLeft;
    const winner = hasWon ? currentPlayer : null;
    const status = hasWon || movesLeft === 0 ? "completed" : "in-progress";
    const result = {
      winner,
      movesLeft: this.movesLeft,
      status,
    };

    if (status === "completed") this.#saveResult(result);

    return result;
  }

  #saveResult(result) {
    this.#setState((state) => {
      if (result.winner) {
        result.winner.wins += 1;
      } else {
        state.ties += 1;
      }
      return state;
    });
  }

  #getState() {
    return this.#state;
  }

  #setState(stateOrFn) {
    const previousState = this.#getState();
    let newState;

    switch (typeof stateOrFn) {
      case "function":
        newState = stateOrFn(previousState);
        break;
      case "object":
        newState = stateOrFn;
        break;
      default:
        throw new Error("InvalidArgumentAsStateException");
    }

    this.#state = newState;
  }

  #addMove(squareId) {
    this.#setState((state) => {
      state.moves.push({
        playerId: this.currentPlayer.id,
        squareId: +squareId,
      });
      return state;
    });
  }

  #playerSquares(player) {
    return this.#getState()
      .moves.filter((moves) => moves.playerId === player.id)
      .map((move) => move.squareId);
  }

  #hasWon(player) {
    let playerWon = false;
    const playerSquares = this.#playerSquares(player);

    this.#winningPatterns.forEach((winningPattern) => {
      if (playerWon) {
        return;
      }
      const result = winningPattern.map((squareId) => {
        return playerSquares.includes(squareId);
      });
      playerWon = result.reduce((acc, currVal) => acc && currVal, true);
    });

    return playerWon;
  }
}
