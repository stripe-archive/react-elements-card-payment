// @flow

const createPaymentIntent = (options) => {
    return window
      .fetch(`/payment_intents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({options}),
      })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        } else {
          return null;
        }
      })
      .then((data) => {
        if (!data || data.error) {
          console.log('API error:', {data});
          throw new Error('PaymentIntent API Error');
        } else {
          return data.client_secret;
        }
      });
  };
  
  const createSetupIntent = (options) => {
    return window
      .fetch(`/setup_intents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({options}),
      })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        } else {
          return null;
        }
      })
      .then((data) => {
        if (!data || data.error) {
          console.log('API error:', {data});
          throw new Error('SetupIntents API Error');
        } else {
          return data.client_secret;
        }
      });
  };
  
  const api = {
    createPaymentIntent,
    createSetupIntent,
  };
  
  export default api;