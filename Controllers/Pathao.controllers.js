const fetch = require('node-fetch');

const fetchFromPathao = async (endpoint, method, token, body = null) => {
  try {
    const response = await fetch(`${process.env.PATHAO_API_ENDPOINT}${endpoint}`, {
      method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.message}`);
    }`  cvbngtfre`

    return await response.json();
  } catch (error) {
    console.error(`Error in ${endpoint} request:`, error);
    throw error;
  }
};



const getToken = async () => {
  try {
    const response = await fetch(`${process.env.PATHAO_API_ENDPOINT}/aladdin/api/v1/issue-token`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.PATHAO_CLIENT_ID,
        client_secret: process.env.PATHAO_CLIENT_SECRET,
        username: process.env.PATHAO_CLIENT_USERNAME,
        password: process.env.PATHAO_CLIENT_PASSWORD,
        grant_type: process.env.PATHAO_CLIENT_GRANT_TYPE,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.message}`);
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error fetching token:', error);
    throw new Error('Failed to fetch token');
  }
};




const createNewStore = async (req, res) => {
  try {
    const token = await getToken();
    const storeData = req.body;
    
    const data = await fetchFromPathao('/aladdin/api/v1/stores', 'POST', token, storeData);
    res.status(201).json({ data });
  } catch (error) {
    console.error('Error creating new store:', error);
    res.status(500).json({ error: 'Failed to create new store' });
  }
};




const getCityList = async (req, res) => {
  try {
    const token = await getToken();
    const data = await fetchFromPathao('/aladdin/api/v1/countries/1/city-list', 'GET', token);
    res.status(200).json({ data });
  } catch (error) {
    console.error('Error getting city list:', error);
    res.status(500).json({ error: 'Failed to get city list' });
  }
};




const getStoreList = async (req, res) => {
  try {
    const token = await getToken();
    const data = await fetchFromPathao('/aladdin/api/v1/stores', 'GET', token);
    res.status(200).json({ data });
  } catch (error) {
    console.error('Error getting store list:', error);
    res.status(500).json({ error: 'Failed to get store list' });
  }
};




const getZoneList = async (req, res) => {
  try {
    const token = await getToken();
    const cityId = req.params.city_id;
    const data = await fetchFromPathao(`/aladdin/api/v1/cities/${cityId}/zone-list`, 'GET', token);
    res.status(200).json({ data });
  } catch (error) {
    console.error('Error getting zone list:', error);
    res.status(500).json({ error: 'Failed to get zone list' });
  }
};




const getAreaList = async (req, res) => {
  try {
    const token = await getToken();
    const zoneId = req.params.zone_id;
    const data = await fetchFromPathao(`/aladdin/api/v1/zones/${zoneId}/area-list`, 'GET', token);
    res.status(200).json({ data });
  } catch (error) {
    console.error('Error getting area list:', error);
    res.status(500).json({ error: 'Failed to get area list' });
  }
};




const getShortInfo = async (req, res) => {
  try {
    const token = await getToken();
    const consignment_id = req.params.consignment_id;
    const data = await fetchFromPathao(`/aladdin/api/v1/orders/${consignment_id}/info`, 'GET', token);
    res.status(200).json({ data });
  } catch (error) {
    console.error('Error getting consignment info:', error);
    res.status(500).json({ error: 'Failed to get consignment info' });
  }
};




const createNewOrder = async (req, res) => {
  try {
    const token = await getToken();
    const orderData = req.body;

    const data = await fetchFromPathao('/aladdin/api/v1/orders', 'POST', token, orderData);
    res.status(201).json({ data });
  } catch (error) {
    console.error('Error creating new order:', error);
    res.status(500).json({ error: 'Failed to create new order' });
  }
};



module.exports = { getCityList, getZoneList, getAreaList, createNewStore, getStoreList, createNewOrder, getShortInfo };
