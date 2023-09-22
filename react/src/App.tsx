import "./App.css";
import Footer from "./components/Footer";
import ResultModal from "./components/ResultModal";

export default function App() {
  const showModal = true;
  const squareIds = [1, 2, 3, 4, 5, 6, 7, 8, 9];
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
          {squareIds.map((id) => {
            return (
              <div key={id} className="square shadow" data-id="square">
                <i className="fa-solid fa-x turquoise"></i>
              </div>
            );
          })}
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
      {showModal && <ResultModal message="Player 1 wins" />}
    </>
  );
}
