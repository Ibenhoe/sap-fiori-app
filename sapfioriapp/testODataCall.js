const axios = require('axios');

const config = {
  client_id: 'sb-d0d82815-47d1-48f9-91e8-9832e4859351!b421096|it-rt-41208216trial!b26655',
  client_secret: '03d51f8b-1731-4e27-8169-c4caca538407$iMKykfaJzlstFReFuIRu42YHN2d_1nU07yUlBO-zaqc=',
  token_url: 'https://41208216trial.authentication.us10.hana.ondemand.com/oauth/token',
  api_url: 'https://41208216trial.it-cpitrial05-rt.cfapps.us10-001.hana.ondemand.com/http/testingReads'
};

async function getAccessToken() {
  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');
  params.append('client_id', config.client_id);
  params.append('client_secret', config.client_secret);

  const response = await axios.post(config.token_url, params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });

  return response.data.access_token;
}

async function callODataService() {
  try {
    const token = await getAccessToken();

    const response = await axios.get(config.api_url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('✅ Response:', response.data);
  } catch (err) {
    console.error('❌ Error:', err.response?.status, err.response?.data || err.message);
  }
}

callODataService();
