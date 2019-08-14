import React, { Component } from "react";
import { CardElement, injectStripe } from "react-stripe-elements";
import "./CheckoutForm.css";
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
    var style = {
      base: {
        color: "#32325d",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#aab7c4"
        }
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a"
      }
    };

    return (
      <div className="checkout-form">
        <div className="sr-payment-form">
          <div className="sr-form-row">
            <form onSubmit={this.handleSubmit}>
              <h1>
                {this.state.amount} {this.state.currency.toLocaleUpperCase()}
              </h1>
              <h4>Pre-order the Pasha package</h4>

              <div className="sr-combo-inputs">
                <div class="sr-combo-inputs-row">
                  <input
                    type="text"
                    id="name"
                    placeholder="Name"
                    autocomplete="cardholder"
                    class="sr-input"
                  />
                </div>

                <div className="sr-combo-inputs-row">
                  <CardElement
                    className="sr-input sr-card-element"
                    style={style}
                  />
                </div>
              </div>
              {this.state.error && (
                <div className="message sr-field-error">{this.state.error}</div>
              )}
              {this.state.message && (
                <div className="sr-field-success message">
                  {this.state.message}
                </div>
              )}
              {!this.state.succeeded && (
                <button className="btn" disabled={this.state.disabled}>
                  {this.state.processing ? "Processing…" : "Pay"}
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default injectStripe(CheckoutForm);
