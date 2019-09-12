import React from "react";
import Checkout from "./checkout";
import DemoText from "./components/DemoText";

import "./App.css";

function App() {
  return (
    <div className="App">
      <div className="sr-root">
        <div className="sr-main">
          <header className="sr-header">
            <div className="sr-header__logo" />
          </header>

          <Checkout />
        </div>

        <div className="sr-content">
          <div className="pasha-image-stack">
            <img
              src="https://picsum.photos/280/320?random=1"
              width="140"
              height="160"
            />
            <img
              src="https://picsum.photos/280/320?random=2"
              width="140"
              height="160"
            />
            <img
              src="https://picsum.photos/280/320?random=3"
              width="140"
              height="160"
            />
            <img
              src="https://picsum.photos/280/320?random=4"
              width="140"
              height="160"
            />
          </div>
        </div>
      </div>
      <DemoText/>
    </div>
  );
}

export default App;
