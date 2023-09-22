import "./App.css";
import Footer from "./components/Footer";

export default function App() {
  return (
    <>
      <main>
        <div data-id="grid" className="grid">
          <div className="turn" data-id="turn">
            <i data-id="turn-icon" className="fa-solid fa-o turquoise"></i>
            <p data-id="turn-text" className="turquoise">
              Player 1, you're up!
            </p>
          </div>

          <div className="menu" data-id="menu">
            <button className="menu-btn" data-id="menu-btn">
              Actions
              <i className="fa-solid fa-chevron-down"></i>
            </button>

            <div className="items border hidden" data-id="menu-items">
              <button data-id="reset-btn">Reset</button>
              <button data-id="new-round-btn">New Round</button>
            </div>
          </div>
          <div id="1" className="square shadow" data-id="square"></div>
          <div id="2" className="square shadow" data-id="square"></div>
          <div id="3" className="square shadow" data-id="square"></div>
          <div id="4" className="square shadow" data-id="square"></div>
          <div id="5" className="square shadow" data-id="square"></div>
          <div id="6" className="square shadow" data-id="square"></div>
          <div id="7" className="square shadow" data-id="square"></div>
          <div id="8" className="square shadow" data-id="square"></div>
          <div id="9" className="square shadow" data-id="square"></div>
          <div className="score score--player-1 shadow">
            <p>Player 1</p>
            <span data-id="score-player-1">0 Wins</span>
          </div>
          <div className="score score--ties shadow">
            <p>Ties</p>
            <span data-id="score-ties">0</span>
          </div>
          <div className="score score--player-2 shadow">
            <p>Player 2</p>
            <span data-id="score-player-2">0 Wins</span>
          </div>
        </div>
      </main>

      <Footer />

      <div data-id="game-result-modal" className="modal hidden">
        <div className="modal-contents">
          <p data-id="game-result-modal-text">Player 1 wins!</p>
          <button data-id="game-result-modal-button">Play again</button>
        </div>
      </div>
    </>
  );
}
