const divisions = require('./divisions.json');
const districtsData = require('./districts.json');
const fetch = require('node-fetch');

const getAllDivisions = (req, res) => {
    const Divisions = divisions.divisions;
    res.status(200).json({ Divisions });
};

function customFilterDistrictsByDivisionId(districts, divisionId) {
    const filteredDistricts = [];
    for (const district of districts) {
        if (district.division_id === divisionId) {
            filteredDistricts.push(district);
        }
    }
    return filteredDistricts;
}


const getDistrictsByDivisionId = (req, res) => {
    const divisionId =req.params.division_id;

    if (!Array.isArray(districtsData.districts) || !districtsData.districts.length) {
        return res.status(500).json({ error: "Districts data is not in the expected format" });
    }
    const districtsInDivision = customFilterDistrictsByDivisionId(districtsData.districts, divisionId);
    if (!districtsInDivision.length) {
        return res.status(404).json({ error: "Districts not found for the given division ID" });
    }
    res.status(200).json({ districts: districtsInDivision });
};


const fetchCityList = async (req, res) => {
    try {
        const API_ENDPOINT = process.env.ECOURIER_API_ENDPOINT || 'https://staging.ecourier.com.bd/api';
        const API_KEY = process.env.ECOURIER_API_KEY || 'YOUR_KEY';
        const API_SECRET = process.env.ECOURIER_API_SECRET || 'YOUR_SECRET';
        const USER_ID = process.env.ECOURIER_USER_ID || 'USER_ID';
        const headers = {
            'API-KEY': API_KEY,
            'API-SECRET': API_SECRET,
            'USER-ID': USER_ID,
            'Content-Type': 'application/json'
        };

        const response = await fetch(`${API_ENDPOINT}/city-list`, {
            method: 'POST',
            headers: headers
        });
        if (!response.ok) {
            throw new Error('Failed to fetch city list');
        }

        const cityList = await response.json();
        res.status(200).json(cityList);
    } catch (error) {
        console.error('Error fetching city list:', error.message);
        res.status(500).json({ error: 'Failed to fetch city list' });
    }
};



module.exports = { getAllDivisions, getDistrictsByDivisionId,fetchCityList };
