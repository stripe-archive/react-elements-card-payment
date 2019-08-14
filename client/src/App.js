import React from "react";
import { Elements, StripeProvider } from "react-stripe-elements";
import CheckoutForm from "./components/CheckoutForm";

import "./App.css";

function App() {
  return (
    <div className="App">
      <StripeProvider apiKey="pk_test_Tr8olTkdFnnJVywwhNPHwnHK00HkHV4tnP">
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

            <Elements>
              <CheckoutForm />
            </Elements>
          </div>
        </div>
      </StripeProvider>
    </div>
  );
}

export default App;
