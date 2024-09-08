const axios = require('axios');

const getNearestProducts = async (latitude, longitude, radius) => {
    const response = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json`, {
        params: {
            location: `${latitude},${longitude}`,
            radius,
            key: process.env.GOOGLE_MAPS_API_KEY,
        },
    });

    return response.data.results;
};

module.exports = {
    getNearestProducts,
};
