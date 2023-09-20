import type { GameScore, Game, Player, Move, PlayerOrNull } from "./types";

export default class View {
  $: Record<string, Element> = {};
  $$: Record<string, NodeListOf<Element>> = {};

  constructor() {
    this.$.menuButton = this.#qsDataId("menu-btn");
    this.$.menuItems = this.#qsDataId("menu-items");
    this.$.resetBtn = this.#qsDataId("reset-btn");
    this.$.newRoundBtn = this.#qsDataId("new-round-btn");
    this.$.gameResultModal = this.#qsDataId("game-result-modal");
    this.$.gameResultText = this.#qsDataId("game-result-modal-text");
    this.$.gameResultButton = this.#qsDataId("game-result-modal-button");
    this.$.turn = this.#qsDataId("turn");
    this.$.turnIcon = this.#qsDataId("turn-icon");
    this.$.turnText = this.#qsDataId("turn-text");
    this.$.player1Score = this.#qsDataId("score-player-1");
    this.$.player2Score = this.#qsDataId("score-player-2");
    this.$.tiesScore = this.#qsDataId("score-ties");
    this.$.grid = this.#qsDataId("grid");

    this.$$.squares = this.#qsAll("[data-id='square']");
    // UI-only event listeners

    this.$.menuButton.addEventListener("click", (event) => {
      this.#toggleMenu();
    });
  }

  render(game: Game, score: GameScore) {
    const { moves, currentPlayer, status } = game;
    this.#updateScore(score);
    this.#closeAll();
    this.#clearGameBoard();
    this.#initializeGameBoard(moves);
    if (status.status === "completed") {
      this.#showResultModal(status.winner);
      return;
    }
    this.#setTurnIndicator(currentPlayer);
  }

  // *** Register event listeners

  bindGameResetEvent(handler: EventListener) {
    this.$.resetBtn.addEventListener("click", handler);
  }

  bindNewRoundEvent(handler: EventListener) {
    this.$.newRoundBtn.addEventListener("click", handler);
  }

  bindPlayerMoveEvent(handler: (el: Element) => void) {
    this.#delegate(this.$.grid, "[data-id='square']", "click", handler);
  }

  bindPlayAgainEvent(handler: EventListener) {
    this.$.gameResultButton.addEventListener("click", handler);
  }

  // *** DOM helper methods

  #closeAll() {
    this.#closeMenu();
    this.#closeModal();
  }

  #closeModal() {
    this.$.gameResultModal.classList.add("hidden");
  }

  #toggleMenu() {
    this.$.menuButton.classList.toggle("border");
    this.$.menuItems.classList.toggle("hidden");

    const icon = this.#qs("i", this.$.menuButton);
    icon.classList.toggle("fa-chevron-up");
    icon.classList.toggle("fa-chevron-down");
  }

  #closeMenu() {
    this.$.menuButton.classList.remove("border");
    this.$.menuItems.classList.add("hidden");

    const icon = this.#qs("i", this.$.menuButton);
    icon.classList.remove("fa-chevron-up");
    icon.classList.add("fa-chevron-down");
  }

  #openMenu() {
    this.$.menuItems.classList.remove("hidden");
    this.$.menuButton.classList.add("border");

    const icon = this.#qs("i", this.$.menuButton);
    icon.classList.remove("fa-chevron-down");
    icon.classList.add("fa-chevron-up");
  }

  #clearGameBoard() {
    this.$$.squares.forEach((square) => square.replaceChildren());
  }

  #initializeGameBoard(moves: Array<Move>) {
    this.#clearGameBoard();
    this.$$.squares.forEach((square) => {
      const existingMove = moves.find((move) => move.squareId === +square.id);

      if (existingMove) this.#handlePlayerMove(square, existingMove.player);
    });
  }

  #handlePlayerMove(squareEl: Element, player: Player) {
    const icon = document.createElement("i");
    icon.classList.add("fa-solid", player.iconClass, player.colorClass);
    squareEl.replaceChildren(icon);
  }

  #showResultModal(winner: PlayerOrNull) {
    const modalMsg = winner ? `${winner.name} wins!` : "Tie";
    this.$.gameResultText.textContent = modalMsg;
    this.$.gameResultModal.classList.remove("hidden");
  }

  #updateScore(score: GameScore) {
    this.$.player1Score.textContent = `${score.player1Wins} wins`;
    this.$.player2Score.textContent = `${score.player2Wins} wins`;
    this.$.tiesScore.textContent = `${score.ties}`;
  }

  #hideResultModal() {
    this.$.gameResultModal.classList.add("hidden");
  }

  // player = 1 | 2
  #setTurnIndicator(player: Player) {
    const icon = document.createElement("i");
    const label = document.createElement("p");

    icon.classList.add("fa-solid", player.iconClass, player.colorClass);
    label.classList.add(player.colorClass);

    label.innerText = `${player.name}, you're up!`;

    this.$.turn.replaceChildren(icon, label);
  }

  #qs(selector: string, parent?: Element): Element {
    const el: Element | null = parent
      ? parent.querySelector(selector)
      : document.querySelector(selector);
    if (!el) throw new Error("ElementNotFoundException");
    return el;
  }

  #qsDataId(dataId: string, parent?: Element): Element {
    return this.#qs(`[data-id='${dataId}']`, parent);
  }

  #qsAll(selector: string, parent?: Element): NodeListOf<Element> {
    const el = parent
      ? parent.querySelectorAll(selector)
      : document.querySelectorAll(selector);
    if (!el) throw new Error("ElementsNotFoundException");
    return el;
  }

  #delegate(
    el: Element,
    selector: string,
    eventKey: string,
    handler: (el: Element) => void
  ) {
    el.addEventListener(eventKey, (event) => {
      if (!(event.target instanceof Element)) {
        throw new Error("EventTargetNotFoundException");
      }
      if (event.target.matches(selector)) {
        handler(event.target);
      }
    });
  }
}
