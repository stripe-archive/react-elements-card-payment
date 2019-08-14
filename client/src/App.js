import React from "react";
import "./App.css";
import { Elements, StripeProvider } from "react-stripe-elements";
import CheckoutForm from "./components/CheckoutForm";

function App() {
  return (
    <div className="App sr-root">
      <StripeProvider apiKey="pk_test_Tr8olTkdFnnJVywwhNPHwnHK00HkHV4tnP">
        <div className="sr-main">
          <header className="sr-header">
            <div className="sr-header__logo" />
          </header>
          <h1>React + Stripe Elements</h1>
          <Elements>
            <CheckoutForm />
          </Elements>
        </div>
      </StripeProvider>
    </div>
  );
}

export default App;
