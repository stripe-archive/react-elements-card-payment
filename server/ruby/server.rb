require 'stripe'
require 'sinatra'
require 'dotenv'

Dotenv.load

Stripe.api_key = ENV['STRIPE_SECRET_KEY']

set :port, 4242
set :bind, '0.0.0.0'

get '/' do
  'Hello from API'
end

get '/public-key' do
  content_type 'application/json'

  response = {
    'publicKey': ENV['STRIPE_PUBLISHABLE_KEY']
  }
  response.to_json
end

get '/product-details' do
  content_type 'application/json'
  data = product_details
  data.to_json
end

post '/create-payment-intent' do
  content_type 'application/json'

  data = JSON.parse(request.body.read)
  product = product_details

  options = product.merge(data)

  payment_intent = Stripe::PaymentIntent.create(options)
  payment_intent.to_json
end

post '/webhook' do
  # You can use webhooks to receive information about asynchronous payment events.
  # For more about our webhook events check out https://stripe.com/docs/webhooks.
  webhook_secret = ENV['STRIPE_WEBHOOK_SECRET']
  payload = request.body.read
  if !webhook_secret.empty?
    # Retrieve the event by verifying the signature using the raw body and secret if webhook signing is configured.
    sig_header = request.env['HTTP_STRIPE_SIGNATURE']
    event = nil
  
    begin
      event = Stripe::Webhook.construct_event(
          payload, sig_header, webhook_secret
      )
    rescue JSON::ParserError => e
        # Invalid payload
        status 400
        return
    rescue Stripe::SignatureVerificationError => e
        # Invalid signature
        puts "⚠️ Webhook signature verification failed."
        status 400
        return
    end
  else
    data = JSON.parse(payload, symbolize_names: true)
    event = Stripe::Event.construct_from(data)
  end
  
  # Get the type of webhook event sent - used to check the status of PaymentIntents.    
  event_type = event['type']
  data = event['data']
  data_object = data['object']

  if event_type == 'payment_intent.succeeded'
    # Fulfill any orders, e-mail receipts, etc
    puts "💰 Payment received!"
  end

  if event_type == 'payment_intent.payment_failed'
    #Notify the customer that their order was not fulfilled
    puts "❌ Payment failed."
  end


  content_type 'application/json'
  {
    status: 'success'
  }.to_json

end


def product_details
  {
    'currency': 'EUR',
    'amount': 9900
  }
end