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
    moves: [],
    gameStatus: { status: "in-progress", winner: null },
  },

  getGameStatus(currentPlayer) {
    const winningPatterns = [
      [1, 2, 3],
      [1, 5, 9],
      [1, 4, 7],
      [2, 5, 8],
      [3, 5, 7],
      [3, 6, 9],
      [4, 5, 6],
      [7, 8, 9],
    ];

    const currentPlayerSquares = App.state.moves
      .filter((move) => move.player === currentPlayer)
      .map((move) => move.squareId);
    let currentPlayerWins = false;

    winningPatterns.forEach((winningPattern) => {
      if (currentPlayerWins) {
        return;
      }
      const result = winningPattern.map((squareId) => {
        return currentPlayerSquares.includes(squareId);
      });
      currentPlayerWins = result.reduce((acc, currVal) => acc && currVal, true);
    });

    return {
      status:
        App.state.moves.length === 9 || currentPlayerWins
          ? "completed"
          : "in-progress",
      winner: currentPlayerWins ? currentPlayer : null,
    };
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
      square.addEventListener("click", (_event) => {
        const hasMove = (squareId) => {
          const existingMove = App.state.moves.find(
            (move) => move.squareId === squareId
          );
          return existingMove !== undefined;
        };

        const gameFinished = App.state.gameStatus.status === "completed";

        if (hasMove(+square.id) || gameFinished) {
          return;
        }

        const movesCount = App.state.moves.length;
        const currentPlayer = movesCount === 0 ? 1 : (movesCount % 2) + 1;

        const icon = document.createElement("i");

        if (currentPlayer === 1) {
          icon.classList.add("fa-solid", "fa-x", "yellow");
        } else {
          icon.classList.add("fa-solid", "fa-o", "turquoise");
        }

        App.state.moves.push({
          player: currentPlayer,
          squareId: +square.id,
        });

        square.replaceChildren(icon);

        // Check if won
        const gameStatus = App.getGameStatus(currentPlayer);
        App.state.gameStatus = gameStatus;
        switch (gameStatus.status) {
          case "completed":
            const winner = gameStatus.winner;
            if (winner) {
              console.log(`Player ${winner} won the game!`);
            } else {
              console.log("It is a tie");
            }
            break;
          case "in-progress":
            console.log("Game continues");
            break;
        }
      });
    });
  },
};

window.addEventListener("load", App.init);
