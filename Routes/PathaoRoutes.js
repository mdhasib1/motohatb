const express = require('express');
const router = express.Router();
const pathaoController = require('../Controllers/Pathao.controllers');

router.get('/city-list', pathaoController.getCityList);
router.get('/city/:city_id/zone-list', pathaoController.getZoneList);
router.get('/zone/:zone_id/area-list', pathaoController.getAreaList);
router.post('/stores', pathaoController.createNewStore);
router.get('/stores', pathaoController.getStoreList);
router.post('/new-order', pathaoController.createNewOrder);
router.get('/order-info/:consignment_id', pathaoController.getShortInfo);

module.exports = router;
