import View from "./view.js";
import Model from "./model.js";

const players = () => {
  return [
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
};

function init() {
  const view = new View();
  const model = new Model(players());

  view.bindGameResetEvent((event) => {
    model.resetGame(players());
    view.clearGameBoard();
    view.toggleMenu();
    view.updateScore(model.score);
  });

  view.bindNewRoundEvent((event) => {
    model.restartGame();
    view.clearGameBoard();
    view.toggleMenu();
  });

  view.bindPlayAgainEvent((event) => {
    view.updateScore(model.score);
    model.restartGame();
    view.clearGameBoard();
    view.hideResultModal();
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
