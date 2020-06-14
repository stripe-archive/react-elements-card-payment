#! /usr/bin/env python3.6

"""
server.py
Stripe Recipe.
Python 3.6 or newer required.
"""

import stripe
import json
import os

from flask import Flask, render_template, jsonify, request, send_from_directory
from dotenv import load_dotenv, find_dotenv

app = Flask(__name__, static_url_path="")

# Setup Stripe python client library
load_dotenv(find_dotenv())
stripe.api_key = os.getenv('STRIPE_SECRET_KEY')
stripe.api_version = os.getenv('STRIPE_API_VERSION')

def product_details():
  return {
    'currency': 'EUR',
    'amount': 9900
  }

@app.route('/', methods=['GET'])
def home():
    return "Hello from API!"

@app.route('/public-key', methods=['GET'])
def PUBLISHABLE_KEY():
    return jsonify({
        'publicKey': os.getenv('STRIPE_PUBLISHABLE_KEY')
    })

@app.route('/product-details', methods=['GET'])
def get_product_details():
    product = product_details()
    return jsonify(product)

@app.route('/create-payment-intent', methods=['POST'])
def post_payment_intent():
    # Reads application/json and returns a response
    data = json.loads(request.data or '{}')
    product = product_details()

    options = dict()
    options.update(data)
    options.update(product)
    
    # Create a PaymentIntent with the order amount and currency
    payment_intent = stripe.PaymentIntent.create(**options)

    try:
        return jsonify(payment_intent)
    except Exception as e:
        return jsonify(error=str(e)), 403

@app.route('/webhook', methods=['POST'])
def webhook_received():
    # You can use webhooks to receive information about asynchronous payment events.
    # For more about our webhook events check out https://stripe.com/docs/webhooks.
    webhook_secret = os.getenv('STRIPE_WEBHOOK_SECRET')
    request_data = json.loads(request.data)

    if webhook_secret:
        # Retrieve the event by verifying the signature using the raw body and secret if webhook signing is configured.
        signature = request.headers.get('stripe-signature')
        try:
            event = stripe.Webhook.construct_event(
                payload=request.data, sig_header=signature, secret=webhook_secret)
            data = event['data']
        except Exception as e:
            return e
        # Get the type of webhook event sent - used to check the status of PaymentIntents.
        event_type = event['type']
    else:
        data = request_data['data']
        event_type = request_data['type']
    data_object = data['object']
    
    print('event ' + event_type)

    if event_type == 'payment_intent.succeeded':
        # Fulfill any orders, e-mail receipts, etc
        print("💰 Payment received!")

    if event_type == 'payment_intent.payment_failed':
        #Notify the customer that their order was not fulfilled
        print("❌ Payment failed.")

    return jsonify({'status': 'success'})


if __name__== '__main__':
    app.run(host='0.0.0.0', port=4242)
