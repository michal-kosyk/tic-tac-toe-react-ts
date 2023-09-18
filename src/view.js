export default class View {
  $ = {};
  $$ = {};

  constructor() {
    this.$.menu = this.#qs("[data-id='menu']");
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

    this.$$.squares = document.querySelectorAll("[data-id='square']");
    // UI-only event listeners

    this.$.menuButton.addEventListener("click", (event) => {
      this.#toggleMenu();
    });
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
      square.addEventListener("click", handler);
    });
  }

  // *** DOM helper methods

  #toggleMenu() {
    this.$.menuItems.classList.toggle("hidden");
    this.$.menuButton.classList.toggle("border");

    const icon = this.$.menuButton.querySelector("i");
    icon.classList.toggle("fa-chevron-down");
    icon.classList.toggle("fa-chevron-up");
  }

  // player = 1 | 2
  setTurnIndicator(player) {
    const icon = document.createElement("i");
    const label = document.createElement("p");

    this.$.turn.classList.remove(player === 1 ? "turquoise" : "yellow");
    this.$.turn.classList.add(player === 1 ? "yellow" : "turquoise");

    icon.classList.add("fa-solid", player === 1 ? "fa-x" : "fa-o");

    label.innerText = `Player ${player}, you're up!`;

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
