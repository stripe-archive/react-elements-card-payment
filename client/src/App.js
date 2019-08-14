import React from 'react';
import './App.css';
import {Elements, StripeProvider} from 'react-stripe-elements';
import CheckoutForm from './components/CheckoutForm';

function App() {
  return (
    <div className="App">
    <StripeProvider apiKey="pk_test_Tr8olTkdFnnJVywwhNPHwnHK00HkHV4tnP">
        <div className="example">
          <h1>React Stripe Elements Example</h1>
          <Elements>
            <CheckoutForm />
          </Elements>
        </div>
      </StripeProvider>
    </div>
  );
}

export default App;
