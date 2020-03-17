require("dotenv").config({ path: "./.env" });
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const { resolve } = require("path");

app.use(bodyParser.json());
app.use(
  express.json({
    // We need the raw body to verify webhook signatures.
    // Let's compute it only when hitting the Stripe webhook endpoint.
    verify: function(req, res, buf) {
      if (req.originalUrl.startsWith("/webhook")) {
        req.rawBody = buf.toString();
      }
    }
  })
);

app.get("/", (req, res) => {
  res.send("Hello from API");
});

app.get("/public-key", (req, res) => {
  res.send({ publishableKey: process.env.STRIPE_PUBLISHABLE_KEY });
});

app.get("/product-details", (req, res) => {
  let data = getProductDetails();
  res.send(data);
});

app.post("/create-payment-intent", async (req, res) => {
  const body = req.body;
  const productDetails = getProductDetails();

  const options = {
    ...body,
    amount: productDetails.amount,
    currency: productDetails.currency
  };

  try {
    const paymentIntent = await stripe.paymentIntents.create(options);
    res.json(paymentIntent);
  } catch (err) {
    res.json(err);
  }
});

let getProductDetails = () => {
  return { currency: "EUR", amount: 9900 };
};

// Webhook handler for asynchronous events.
app.post("/webhook", async (req, res) => {
  let data;
  let eventType;
  // Check if webhook signing is configured.
  if (process.env.STRIPE_WEBHOOK_SECRET) {
    // Retrieve the event by verifying the signature using the raw body and secret.
    let event;
    let signature = req.headers["stripe-signature"];

    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.log(`⚠️ Webhook signature verification failed.`);
      return res.sendStatus(400);
    }
    // Extract the object from the event.
    data = event.data;
    eventType = event.type;
  } else {
    // Webhook signing is recommended, but if the secret is not configured in `config.js`,
    // retrieve the event data directly from the request body.
    data = req.body.data;
    eventType = req.body.type;
  }

  if (eventType === "payment_intent.succeeded") {
    // Fulfill any orders, e-mail receipts, etc
    console.log("💰 Payment received!");
  }

  if (eventType === "payment_intent.payment_failed") {
    // Notify the customer that their order was not fulfilled
    console.log("❌ Payment failed.");
  }

  res.sendStatus(200);
});

app.listen(4242, () => console.log(`Node server listening on port ${4242}!`));
