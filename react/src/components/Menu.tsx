import { useState } from "react";
import "./Menu.css";

type Props = {
  onAction(action: "reset" | "new-round"): void;
};

export default function Menu({ onAction }: Props) {
  const [menuOpened, setMenuOpened] = useState(false);

  return (
    <div className="menu" onClick={() => setMenuOpened(!menuOpened)}>
      <button className="menu-btn">
        Actions
        <i
          className={`fa-solid ${
            menuOpened ? "fa-chevron-up" : "fa-chevron-down"
          }`}
        ></i>
      </button>
      {menuOpened && (
        <div className="items border">
          <button onClick={() => onAction("reset")}>Reset</button>
          <button onClick={() => onAction("new-round")}>New Round</button>
        </div>
      )}
    </div>
  );
}
