import React, { Component } from "react";
import { Elements, StripeProvider } from "react-stripe-elements";
import CheckoutForm from "./components/CheckoutForm";

class Checkout extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="checkout">
        <StripeProvider apiKey="pk_test_Tr8olTkdFnnJVywwhNPHwnHK00HkHV4tnP">
          <Elements>
            <CheckoutForm />
          </Elements>
        </StripeProvider>
      </div>
    );
  }
}

export default Checkout;
