import React, { Component } from "react";
import { CardElement, injectStripe } from "react-stripe-elements";
import "./checkoutForm.css";
import api from "../api";

class CheckoutForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      amount: 99,
      currency: "usd",
      clientSecret: null,
      error: null,
      disabled: false,
      succeeded: false,
      processing: false,
      message: null
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async handleSubmit(ev) {
    ev.preventDefault();

    // Step 1: Create PaymentIntent over Stripe API
    api
      .createPaymentIntent({
        amount: this.state.amount,
        currency: this.state.currency,
        payment_method_types: ["card"]
      })
      .then(clientSecret => {
        this.setState({
          clientSecret: clientSecret,
          disabled: true,
          processing: true
        });

        // Step 2: Use clientSecret from PaymentIntent to handle payment in stripe.handleCardPayment() call
        this.props.stripe
          .handleCardPayment(this.state.clientSecret)
          .then(payload => {
            if (payload.error) {
              this.setState({
                error: `Charge failed: ${payload.error.message}`,
                disabled: false,
                processing: false
              });
              console.log("[error]", payload.error);
            } else {
              this.setState({
                processing: false,
                succeeded: true,
                error: "",
                message: `Charge succeeded! PaymentIntent is in state: ${
                  payload.paymentIntent.status
                }`
              });
              console.log("[PaymentIntent]", payload.paymentIntent);
            }
          });
      })
      .catch(err => {
        this.setState({ error: err.message });
      });
  }

  render() {
    return (
      <div className="checkout">
        <div className="form">
          <form onSubmit={this.handleSubmit}>
            <h3>Payment Intent</h3> Make a payment with a charge from the
            creditcard.
            <p>
              Amount: {this.state.amount}{" "}
              {this.state.currency.toLocaleUpperCase()}
            </p>
            <CardElement />
            {this.state.error && (
              <div className="message error">{this.state.error}</div>
            )}
            {this.state.message && (
              <div className="message">{this.state.message}</div>
            )}
            {!this.state.succeeded && (
              <button disabled={this.state.disabled}>
                {this.state.processing ? "Processing…" : "Pay"}
              </button>
            )}
          </form>
        </div>
      </div>
    );
  }
}

export default injectStripe(CheckoutForm);
