const express = require('express');
const router = express.Router();
const {
    createOparatingation,
    getOparatingationByProductId,
    updateOparatingationByProductId,
    deleteOparatingationByProductId,
    getAllProductsWithOparatingation
} = require('../Controllers/instalation.controllers');

router.post('/oparating-charge', createOparatingation);
router.get('/oparating-charge/:productId', getOparatingationByProductId);
router.put('/oparating-charge/:productId', updateOparatingationByProductId);
router.delete('/oparating-charge/:productId', deleteOparatingationByProductId);
router.get('/oparating-charge/products/with-oparating-charge', getAllProductsWithOparatingation);

module.exports = router;
