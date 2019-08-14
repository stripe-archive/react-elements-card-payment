const express = require("express");
const app = express();
const { resolve } = require("path");
const envPath = resolve(__dirname, "../../.env");
const env = require("dotenv").config({ path: envPath });
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

app.use(express.static(resolve(__dirname, "../../client")));

app.get("/", (req, res) => {
  const path = resolve(__dirname, "../../client/index.html");
  res.sendFile(path);
});

app.post("/payment_intents", async (req, res) => {
  const { options } = req.body;

  const paymentIntent = await stripe.paymentIntents.create(options);
  res.json(paymentIntent);
});

app.post("/setup_intents", async (req, res) => {
  const { options } = req.body;

  const setupIntent = await stripe.setupIntents.create(options);
  res.json(setupIntent);
});

app.listen(4242, () => console.log(`Node server listening on port ${4242}!`));
