import type {
  Game,
  Player,
  GameResult,
  GameState,
  Move,
  GameScore,
  PlayerOrNull,
} from "./types";

const initialState = () => {
  return { moves: [], gameResults: [] };
};
const MAX_MOVES = 9;

type SaveStateCb = (prevState: GameState) => GameState;

export default class Model extends EventTarget {
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

  constructor(
    private readonly players: Array<Player>,
    private readonly storageKey: string
  ) {
    super();
  }

  get currentPlayer(): Player {
    const state: GameState = this.#getState();
    const moves: Array<Move> = state.moves;

    return this.players[moves.length % 2];
  }

  get movesLeft(): number {
    return MAX_MOVES - this.#getState().moves.length;
  }

  get score(): GameScore {
    const gameResults: Array<GameResult> = this.#getState().gameResults;
    const player1: Player = this.players[0];
    const player2: Player = this.players[1];
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

  get moves(): Array<Move> {
    return this.#getState().moves;
  }

  restartGame() {
    this.#setState((state: GameState) => {
      state.moves = [];
      return state;
    });
  }

  resetGame() {
    this.#setState((state: GameState) => {
      state.gameResults = [];
      return state;
    });
    this.restartGame();
  }

  isSquareTaken(squareId: number): boolean {
    const existingMove: Move | undefined = this.#getState().moves.find(
      (move: Move) => {
        return move.squareId === squareId;
      }
    );

    return existingMove !== undefined;
  }

  get winningPlayer(): PlayerOrNull {
    let winner: PlayerOrNull = null;
    this.players.forEach((player: Player) => {
      if (this.#hasWon(player)) {
        winner = player;
        return;
      }
    });
    return winner;
  }

  get game(): Game {
    const movesLeft: number = this.movesLeft;
    const winner: PlayerOrNull = this.winningPlayer;
    const status = winner || movesLeft === 0 ? "completed" : "in-progress";

    return {
      moves: this.moves,
      currentPlayer: this.currentPlayer,
      status: {
        winner,
        movesLeft,
        status,
      },
    };
  }

  makeMove(squareId: number) {
    const currentPlayer: Player = this.currentPlayer;

    this.#addMove(squareId);

    const hasWon: boolean = this.#hasWon(currentPlayer);
    const movesLeft: number = this.movesLeft;
    const winner: PlayerOrNull = hasWon ? currentPlayer : null;
    const status: string =
      hasWon || movesLeft === 0 ? "completed" : "in-progress";
    const result: GameResult = {
      winner,
      movesLeft: this.movesLeft,
      status,
    };

    if (status === "completed") this.#saveResult(result);

    return result;
  }

  #saveResult(result: GameResult) {
    this.#setState((state: GameState) => {
      state.gameResults.push(result);
      return state;
    });
  }

  #getState(): GameState {
    const item = window.localStorage.getItem(this.storageKey);
    if (item === "undefined" || item === null) return initialState();
    return JSON.parse(item);
  }

  #setState(stateOrFn: GameState | SaveStateCb) {
    const previousState: GameState = this.#getState();
    let newState: GameState;

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

    window.localStorage.setItem(this.storageKey, JSON.stringify(newState));
    this.dispatchEvent(new Event("statechange"));
  }

  #addMove(squareId: number) {
    this.#setState((state: GameState) => {
      state.moves.push({
        player: this.currentPlayer,
        squareId: +squareId,
      });
      return state;
    });
  }

  #playerSquares(player: Player): Array<number> {
    return this.#getState()
      .moves.filter((moves: Move) => moves.player.id === player.id)
      .map((move: Move) => move.squareId);
  }

  #hasWon(player: Player): boolean {
    let playerWon: boolean = false;
    const playerSquares: Array<number> = this.#playerSquares(player);

    this.#winningPatterns.forEach((winningPattern: Array<number>) => {
      if (playerWon) {
        return;
      }
      const result: Array<boolean> = winningPattern.map((squareId) => {
        return playerSquares.includes(squareId);
      });
      playerWon = result.reduce(
        (acc: boolean, currVal: boolean) => acc && currVal,
        true
      );
    });

    return playerWon;
  }
}
