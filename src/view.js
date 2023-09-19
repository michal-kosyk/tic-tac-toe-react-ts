export default class View {
  $ = {};
  $$ = {};

  constructor() {
    this.$.menuButton = this.#qs("[data-id='menu-btn']");
    this.$.menuItems = this.#qs("[data-id='menu-items']");
    this.$.resetBtn = this.#qs("[data-id='reset-btn']");
    this.$.newRoundBtn = this.#qs("[data-id='new-round-btn']");
    this.$.gameResultModal = this.#qs("[data-id='game-result-modal']");
    this.$.gameResultText = this.#qs("[data-id='game-result-modal-text']");
    this.$.gameResultButton = this.#qs("[data-id='game-result-modal-button']");
    this.$.turn = this.#qs("[data-id='turn']");
    this.$.turnIcon = this.#qs("[data-id='turn-icon']");
    this.$.turnText = this.#qs("[data-id='turn-text']");
    this.$.player1Score = this.#qs("[data-id='score-player-1'");
    this.$.player2Score = this.#qs("[data-id='score-player-2'");
    this.$.tiesScore = this.#qs("[data-id='score-ties'");

    this.$$.squares = this.#qsAll("[data-id='square']");
    // UI-only event listeners

    this.$.menuButton.addEventListener("click", (event) => {
      this.#toggleMenu();
    });
  }

  render(game, score) {
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

  bindGameResetEvent(handler) {
    this.$.resetBtn.addEventListener("click", handler);
  }

  bindNewRoundEvent(handler) {
    this.$.newRoundBtn.addEventListener("click", handler);
  }

  bindPlayerMoveEvent(handler) {
    this.$$.squares.forEach((square) => {
      square.addEventListener("click", () => handler(square));
    });
  }

  bindPlayAgainEvent(handler) {
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

    const icon = this.$.menuButton.querySelector("i");
    icon.classList.toggle("fa-chevron-up");
    icon.classList.toggle("fa-chevron-down");
  }

  #closeMenu() {
    this.$.menuButton.classList.remove("border");
    this.$.menuItems.classList.add("hidden");

    const icon = this.$.menuButton.querySelector("i");
    icon.classList.remove("fa-chevron-up");
    icon.classList.add("fa-chevron-down");
  }

  #openMenu() {
    this.$.menuItems.classList.remove("hidden");
    this.$.menuButton.classList.add("border");

    const icon = this.$.menuButton.querySelector("i");
    icon.classList.remove("fa-chevron-down");
    icon.classList.add("fa-chevron-up");
  }

  #clearGameBoard() {
    this.$$.squares.forEach((square) => square.replaceChildren());
  }

  #initializeGameBoard(moves) {
    this.#clearGameBoard();
    this.$$.squares.forEach((square) => {
      const existingMove = moves.find((move) => move.squareId === +square.id);

      if (existingMove) this.#handlePlayerMove(square, existingMove.player);
    });
  }

  #handlePlayerMove(squareEl, player) {
    const icon = document.createElement("i");
    icon.classList.add("fa-solid", player.iconClass, player.colorClass);
    squareEl.replaceChildren(icon);
  }

  #showResultModal(winner) {
    const modalMsg = winner ? `${winner.name} wins!` : "Tie";
    this.$.gameResultText.textContent = modalMsg;
    this.$.gameResultModal.classList.remove("hidden");
  }

  #updateScore(score) {
    this.$.player1Score.textContent = `${score.player1Wins} wins`;
    this.$.player2Score.textContent = `${score.player2Wins} wins`;
    this.$.tiesScore.textContent = `${score.ties}`;
  }

  #hideResultModal() {
    this.$.gameResultModal.classList.add("hidden");
  }

  // player = 1 | 2
  #setTurnIndicator(player) {
    const icon = document.createElement("i");
    const label = document.createElement("p");

    icon.classList.add("fa-solid", player.iconClass, player.colorClass);
    label.classList.add(player.colorClass);

    label.innerText = `${player.name}, you're up!`;

    this.$.turn.replaceChildren(icon, label);
  }

  #qs(selector, parent) {
    const el = parent
      ? parent.querySelector(selector)
      : document.querySelector(selector);
    if (!el) throw new Error("ElementNotFoundException");
    return el;
  }

  #qsAll(selector, parent) {
    const el = parent
      ? parent.querySelectorAll(selector)
      : document.querySelectorAll(selector);
    if (!el) throw new Error("ElementsNotFoundException");
    return el;
  }
}
