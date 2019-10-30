<?php
use Slim\Http\Request;
use Slim\Http\Response;
use Stripe\Stripe;

require 'vendor/autoload.php';

$dotenv = Dotenv\Dotenv::create(__DIR__);
$dotenv->load();

$config = [
  'settings' => [
      'displayErrorDetails' => true,
  ]
];

$app = new \Slim\App($config);

// Instantiate the logger as a dependency
$container = $app->getContainer();
$container['logger'] = function ($c) {
  $settings = $c->get('settings')['logger'];
  $logger = new Monolog\Logger($settings['name']);
  $logger->pushProcessor(new Monolog\Processor\UidProcessor());
  $logger->pushHandler(new Monolog\Handler\StreamHandler(__DIR__ . '/logs/app.log', \Monolog\Logger::DEBUG));
  return $logger;
};

$app->add(function ($request, $response, $next) {
    Stripe::setApiKey(getenv('STRIPE_SECRET_KEY'));
    return $next($request, $response);
});
  
$app->get('/', function (Request $request, Response $response, array $args) {   
    return $response->write("Hello from API");
});

$app->get('/public-key', function (Request $request, Response $response, array $args) {
    $pub_key = getenv('STRIPE_PUBLISHABLE_KEY');
    $data = array('publicKey' => $pub_key);
    return $response->withJson($data);
});

$app->get('/product-details', function (Request $request, Response $response, array $args) {
  $data = product_details();
  return $response->withJson($data);
});


$app->post('/create-payment-intent', function(Request $request, Response $response) {
  $body = $request->getParsedBody();
  $product = product_details();
  $options = array_merge($body, $product);

  $payment_intent = \Stripe\PaymentIntent::create($options);

  return $response->withJson($payment_intent);
});

$app->post('/webhook', function(Request $request, Response $response) {
    $logger = $this->get('logger');
    $event = $request->getParsedBody();
    // Parse the message body (and check the signature if possible)
    $webhookSecret = getenv('STRIPE_WEBHOOK_SECRET');
    if ($webhookSecret) {
      try {
        $event = \Stripe\Webhook::constructEvent(
          $request->getBody(),
          $request->getHeaderLine('stripe-signature'),
          $webhookSecret
        );
      } catch (\Exception $e) {
        return $response->withJson([ 'error' => $e->getMessage() ])->withStatus(403);
      }
    } else {
      $event = $request->getParsedBody();
    }
    $type = $event['type'];
    $object = $event['data']['object'];
  
    $logger->info('🔔 Webhook received! ' . $type);

    if($type == 'payment_intent.succeeded') {
      # Fulfill any orders, e-mail receipts, etc
      $logger->info("💰 Payment received!");
    }

    if($type == 'payment_intent.payment_failed') {
      #Notify the customer that their order was not fulfilled
      $logger->info("❌ Payment failed.");
    }
  
    return $response->withJson([ 'status' => 'success' ])->withStatus(200);
});

$app->run();


 function product_details() {
  return array('currency' => 'EUR', 'amount' => 9900 );
};
