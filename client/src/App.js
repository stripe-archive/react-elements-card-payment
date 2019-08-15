import React from "react";
import Checkout from "./checkout";

import "./App.css";

function App() {
  return (
    <div className="App">
      <div className="sr-root">
        <div className="sr-content">
          <header className="sr-header">
            <div className="sr-header__logo" />
          </header>
          <h1>React + Stripe Elements</h1>
          <h4>
            Make a payment with a charge from the creditcard using
            PaymentIntents.
          </h4>

          <Checkout />
        </div>
      </div>
    </div>
  );
}

export default App;
