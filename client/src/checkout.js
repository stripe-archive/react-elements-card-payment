import React, { useState, useEffect } from "react";
import { Elements } from "@stripe/react-stripe";
import CheckoutForm from "./components/CheckoutForm";
import api from "./api";

export default function Checkout() {
  const [stripe, setStripe] = useState(null);

  useEffect(() => {
    api.getPublicStripeKey().then(apiKey => {
      setStripe(window.Stripe(apiKey));
    });
  }, []);

  return (
    <div className="checkout">
      <Elements stripe={stripe}>
        <CheckoutForm />
      </Elements>
    </div>
  );
}
