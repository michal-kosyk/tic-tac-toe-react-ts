import View from "./view.js";
import Model from "./model.js";

const players = [
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

const storageKey = "tic-tac-toe";

function init() {
  const view = new View();
  const model = new Model(players, storageKey);

  const initView = () => {
    view.updateScore(model.score);
    view.clearGameBoard();
    view.hideResultModal();
    view.setTurnIndicator(model.currentPlayer);
    view.initializeGameBoard(model.moves);
  };

  initView();

  view.bindGameResetEvent((event) => {
    model.resetGame(players);
    initView();
    view.toggleMenu();
  });

  view.bindNewRoundEvent((event) => {
    model.restartGame();
    view.clearGameBoard();
    view.toggleMenu();
  });

  view.bindPlayAgainEvent((event) => {
    model.restartGame();
    initView();
  });

  view.bindPlayerMoveEvent((square) => {
    if (model.isSquareTaken(+square.id)) return;

    view.handlePlayerMove(square, model.currentPlayer);

    const moveResult = model.makeMove(square.id);
    if (moveResult.status === "completed") {
      view.showResultModal(moveResult);
      return;
    }
    view.setTurnIndicator(model.currentPlayer);
  });
}

window.addEventListener("load", init);
