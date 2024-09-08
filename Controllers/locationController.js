const axios = require('axios');
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;


const getDivisions = async (req, res) => {
    try {
      const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          address: 'Bangladesh',
          components: 'country:BD',
          key: GOOGLE_MAPS_API_KEY,
        },
      });
  
      if (response.data.status === 'REQUEST_DENIED') {
        return res.status(403).json({ error: 'Google Maps API key access denied' });
      }

      if (!response.data.results.length) {
        return res.status(404).json({ error: 'No results found' });
      }

      const divisions = response.data.results[0].address_components
  
      res.json(divisions);
    } catch (error) {
      console.error('Error fetching divisions:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  

const getDistricts = async (req, res) => {
    try {
      const { division } = req.query;
      if (!division) {
        return res.status(400).json({ error: 'Division parameter is required' });
      }
  
      console.log(division)
  
      const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          address: division,
          key: GOOGLE_MAPS_API_KEY,
        },
      });
      console.log(response.data)
      if (response.data.status === 'REQUEST_DENIED') {
        return res.status(403).json({ error: 'Google Maps API key access denied' });
      }
  
      console.log('Geocode response data:', response.data);
      if (!response.data.results.length) {
        return res.status(404).json({ error: 'Division not found' });
      }
  
      const location = response.data.results[0].geometry.location;
      console.log(location)
      const districtResponse = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
        params: {
          location: `${location.lat},${location.lng}`,
          radius: 50000,
          type: 'administrative_area_level_2',
          key: GOOGLE_MAPS_API_KEY,
        },
      });
      console.log(districtResponse)
      res.json(districtResponse.data.results);
    } catch (error) {
      console.error('Error fetching districts:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

const getUpazilas = async (req, res) => {
  try {
    const { district } = req.query;
    if (!district) {
      return res.status(400).json({ error: 'District parameter is required' });
    }

    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: district,
        key: GOOGLE_MAPS_API_KEY,
      },
    });

    if (!response.data.results.length) {
      return res.status(404).json({ error: 'District not found' });
    }

    const location = response.data.results[0].geometry.location;
    const upazilaResponse = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
      params: {
        location: `${location.lat},${location.lng}`,
        radius: 50000,
        type: 'administrative_area_level_3',
        key: GOOGLE_MAPS_API_KEY,
      },
    });
    res.json(upazilaResponse.data.results);
  } catch (error) {
    console.error('Error fetching upazilas:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getDivisions,
  getDistricts,
  getUpazilas,
};
