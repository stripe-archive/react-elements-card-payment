import React from "react";
import Checkout from "./checkout";

import "./App.css";

function App() {
  return (
    <div className="App">
      <div className="sample-info">
        <h1>Stripe React Card Payment</h1>
        <h4>
          This sample shows how to build a card form to take a payment using the
          Payment Intents API, Stripe Elements and React.
        </h4>
      </div>

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
    </div>
  );
}

export default App;
