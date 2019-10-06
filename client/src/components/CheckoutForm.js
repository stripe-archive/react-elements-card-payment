import React, { Component } from "react";
import { CardElement, injectStripe } from "react-stripe-elements";
import "./CheckoutForm.css";
import api from "../api";

class CheckoutForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      amount: 0,
      currency: "",
      clientSecret: null,
      error: null,
      metadata: null,
      disabled: false,
      succeeded: false,
      processing: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    // Step 1: Fetch product details such as amount and currency from API to make sure it can't be tampered with in the client.
    api.getProductDetails().then(productDetails => {
      this.setState({
        amount: productDetails.amount / 100,
        currency: productDetails.currency
      });
    });
  }

  async handleSubmit(ev) {
    ev.preventDefault();

    // Step 1: Create PaymentIntent over Stripe API
    api
      .createPaymentIntent({
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
                error: `Payment failed: ${payload.error.message}`,
                disabled: false,
                processing: false
              });
              console.log("[error]", payload.error);
            } else {
              this.setState({
                processing: false,
                succeeded: true,
                error: "",
                metadata: payload.paymentIntent
              });
              console.log("[PaymentIntent]", payload.paymentIntent);
            }
          });
      })
      .catch(err => {
        this.setState({ error: err.message });
      });
  }

  renderSuccess() {
    return (
      <div className="sr-field-success message">
        <h1>Your test payment succeeded</h1>
        <p>View PaymentIntent response:</p>
        <pre className="sr-callout">
          <code>{JSON.stringify(this.state.metadata, null, 2)}</code>
        </pre>
      </div>
    );
  }

  renderForm() {
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
      <form onSubmit={this.handleSubmit}>
        <h1>
          {this.state.currency.toLocaleUpperCase()}{" "}
          {this.state.amount.toLocaleString(navigator.language, {
            minimumFractionDigits: 2
          })}{" "}
        </h1>
        <h4>Pre-order the Pasha package</h4>

        <div className="sr-combo-inputs">
          <div className="sr-combo-inputs-row">
            <input
              type="text"
              id="name"
              placeholder="Name"
              autoComplete="cardholder"
              className="sr-input"
            />
          </div>

          <div className="sr-combo-inputs-row">
            <CardElement className="sr-input sr-card-element" style={style} />
          </div>
        </div>

        {this.state.error && (
          <div className="message sr-field-error">{this.state.error}</div>
        )}

        {!this.state.succeeded && (
          <button className="btn" disabled={this.state.disabled}>
            {this.state.processing ? "Processing…" : "Pay"}
          </button>
        )}
      </form>
    );
  }

  render() {
    return (
      <div className="checkout-form">
        <div className="sr-payment-form">
          <div className="sr-form-row" />
          {this.state.succeeded && this.renderSuccess()}
          {!this.state.succeeded && this.renderForm()}
        </div>
      </div>
    );
  }
}

export default injectStripe(CheckoutForm);
