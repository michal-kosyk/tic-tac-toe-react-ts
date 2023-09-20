export type Player = {
  id: number;
  name: string;
  iconClass: string;
  colorClass: string;
};

export type PlayerOrNull = Player | null;

export type Move = {
  player: Player;
  squareId: number;
};

export type GameResult = {
  winner: Player | null;
  movesLeft: number;
  status: string;
};

export type GameState = {
  moves: Array<Move>;
  gameResults: Array<GameResult>;
};

export type Game = {
  moves: Array<Move>;
  currentPlayer: Player;
  status: GameResult;
};

export type GameScore = {
  player1Wins: number;
  player2Wins: number;
  ties: number;
};
