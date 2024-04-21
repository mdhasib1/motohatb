const fetch = require('node-fetch');

const getToken = async () => {
  try {
    const response = await fetch(`${process.env.PATHAO_API_ENDPOINT}/aladdin/api/v1/issue-token`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        client_id: process.env.PATHAO_CLIENT_ID,
        client_secret: process.env.PATHAO_CLIENT_SECRET,
        username: process.env.PATHAO_CLIENT_USERNAME,
        password: process.env.PATHAO_CLIENT_PASSWORD,
        grant_type: process.env.PATHAO_CLIENT_GRANT_TYPE,
      })
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
    const { name, contact_name, contact_number, secondary_contact, address, city_id, zone_id, area_id } = req.body;
    
    const response = await fetch(`${process.env.PATHAO_API_ENDPOINT}/aladdin/api/v1/stores`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name,
        contact_name,
        contact_number,
        secondary_contact,
        address,
        city_id,
        zone_id,
        area_id
      })
    });


    const data = await response.json();
    res.status(201).json({ data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to create new store' });
  }
};


const getCityList = async (req, res) => {
  try {
    const token = await getToken();
    const response = await fetch(`${process.env.PATHAO_API_ENDPOINT}/aladdin/api/v1/countries/1/city-list`, {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    res.status(200).json({ data });
  } catch (error) {
    console.error('Error getting city list:', error);
    res.status(500).json({ error: 'Failed to get city list' });
  }
};
const getStoreList = async (req, res) => {
  try {
    const token = await getToken();
    const response = await fetch(`${process.env.PATHAO_API_ENDPOINT}/aladdin/api/v1/stores`, {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    res.status(200).json({ data });
  } catch (error) {
    console.error('Error getting city list:', error);
    res.status(500).json({ error: 'Failed to get city list' });
  }
};

const getZoneList = async (req, res) => {
  try {
    const token = await getToken();
    const cityId = req.params.city_id;
    console.log(cityId)
    const response = await fetch(`${process.env.PATHAO_API_ENDPOINT}/aladdin/api/v1/cities/${cityId}/zone-list`, {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
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
    const response = await fetch(`${process.env.PATHAO_API_ENDPOINT}/aladdin/api/v1/zones/${zoneId}/area-list`, {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
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
    const response = await fetch(`${process.env.PATHAO_API_ENDPOINT}/aladdin/api/v1/orders/${consignment_id}/info`, {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    res.status(200).json({ data });
  } catch (error) {
    console.error('Error getting area list:', error);
    res.status(500).json({ error: 'Failed to get area list' });
  }
};

const createNewOrder = async (req, res) => {
  try {
    const token = await getToken();
    const {
      store_id,
      merchant_order_id,
      sender_name,
      sender_phone,
      recipient_name,
      recipient_phone,
      recipient_address,
      recipient_city,
      recipient_zone,
      recipient_area,
      delivery_type,
      item_type,
      special_instruction,
      item_quantity,
      item_weight,
      amount_to_collect,
      item_description
    } = req.body;
    
    const response = await fetch(`${process.env.PATHAO_API_ENDPOINT}/aladdin/api/v1/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        store_id,
        merchant_order_id,
        sender_name,
        sender_phone,
        recipient_name,
        recipient_phone,
        recipient_address,
        recipient_city,
        recipient_zone,
        recipient_area,
        delivery_type,
        item_type,
        special_instruction,
        item_quantity,
        item_weight,
        amount_to_collect,
        item_description
      })
    });

    const data = await response.json();
    res.status(201).json({ data });
  } catch (error) {
    console.error('Error creating new order:', error);
    res.status(500).json({ error: 'Failed to create new order' });
  }
};

module.exports = { getCityList, getZoneList, getAreaList,createNewStore,getStoreList,createNewOrder ,getShortInfo};
