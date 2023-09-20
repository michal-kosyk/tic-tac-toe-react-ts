import View from "./view.js";
import Model from "./model.js";
import type { Player } from "./types";

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

const storageKey: string = "tic-tac-toe";

function init() {
  const view: View = new View();
  const model: Model = new Model(players, storageKey);

  model.addEventListener("statechange", () => {
    view.render(model.game, model.score);
  });

  window.addEventListener("storage", () => {
    view.render(model.game, model.score);
  });

  view.render(model.game, model.score);

  view.bindGameResetEvent(() => {
    model.resetGame();
  });

  view.bindNewRoundEvent(() => {
    model.restartGame();
  });

  view.bindPlayAgainEvent(() => {
    model.restartGame();
  });

  view.bindPlayerMoveEvent((square: Element) => {
    if (model.isSquareTaken(+square.id)) return;

    model.makeMove(+square.id);
  });
}

window.addEventListener("load", init);
