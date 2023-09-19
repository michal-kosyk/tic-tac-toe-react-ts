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

  window.addEventListener("storage", () => {
    view.render(model.game, model.score);
  });

  view.render(model.game, model.score);

  view.bindGameResetEvent((event) => {
    model.resetGame(players);
    view.render(model.game, model.score);
  });

  view.bindNewRoundEvent((event) => {
    model.restartGame();
    view.render(model.game, model.score);
  });

  view.bindPlayAgainEvent((event) => {
    model.restartGame();
    view.render(model.game, model.score);
  });

  view.bindPlayerMoveEvent((square) => {
    if (model.isSquareTaken(+square.id)) return;

    model.makeMove(square.id);
    view.render(model.game, model.score);
  });
}

window.addEventListener("load", init);
