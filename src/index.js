const App = {
  $: {
    menu: document.querySelector("[data-id='menu']"),
    menuButton: document.querySelector("[data-id='menu-btn']"),
    menuItems: document.querySelector("[data-id='menu-items']"),
    resetBtn: document.querySelector("[data-id='reset-btn']"),
    newRoundBtn: document.querySelector("[data-id='new-round-btn']"),
    squares: document.querySelectorAll("[data-id='square']"),
  },

  state: {
    currentPlayer: 1,
  },

  init() {
    App.registerEventListeners();
  },

  registerEventListeners() {
    // DONE
    App.$.menuButton.addEventListener("click", (event) => {
      App.$.menuItems.classList.toggle("hidden");
    });

    // TODO
    App.$.resetBtn.addEventListener("click", (event) => {
      console.log("Reset round!");
    });

    // TODO
    App.$.newRoundBtn.addEventListener("click", (event) => {
      console.log("New Round!");
    });

    // TODO
    App.$.squares.forEach((square) => {
      square.addEventListener("click", (event) => {
        const currentPlayer = App.state.currentPlayer;

        const icon = document.createElement("i");

        if (currentPlayer === 1) {
          icon.classList.add("fa-solid", "fa-x", "yellow");
        } else {
          icon.classList.add("fa-solid", "fa-o", "turquoise");
        }

        App.state.currentPlayer = App.state.currentPlayer === 1 ? 2 : 1;

        event.target.replaceChildren(icon);
        // <i class="fa-solid fa-x yellow"></i>
        // <i class="fa-solid fa-o turquoise"></i>
      });
    });
  },
};

window.addEventListener("load", App.init);
