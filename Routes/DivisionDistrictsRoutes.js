const express = require('express');
const router = express.Router();
const DivisionDistricts = require('../Controllers/DivisionDistricts');


router.get('/divisions', DivisionDistricts.getAllDivisions);
router.get('/division/:division_id/districts', DivisionDistricts.getDistrictsByDivisionId);
router.get('/division/:division_id/districts', DivisionDistricts.getDistrictsByDivisionId);
router.post('/divisions/city-list', DivisionDistricts.fetchCityList);

module.exports = router;
