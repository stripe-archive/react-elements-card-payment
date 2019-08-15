import React, { Component } from "react";
import { Elements, StripeProvider } from "react-stripe-elements";
import CheckoutForm from "./components/CheckoutForm";
import api from "./api";

class Checkout extends Component {
  constructor(props) {
    super(props);

    this.state = {
      apiKey: null
    };
  }

  componentDidMount() {
    api.getPublicStripeKey().then(apiKey => {
      this.setState({
        apiKey: apiKey
      });
    });
  }

  render() {
    return (
      <div className="checkout">
        {this.state.apiKey && (
          <StripeProvider apiKey={this.state.apiKey}>
            <Elements>
              <CheckoutForm />
            </Elements>
          </StripeProvider>
        )}
      </div>
    );
  }
}

export default Checkout;
