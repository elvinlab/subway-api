'use strict'

var express = require('express');
var PriceController = require('../controllers/price');

var router = express.Router();
var md_auth = require('../middlewares/authenticated');

router.post('/price', md_auth.authenticated, PriceController.save);
router.put('/price/:id', md_auth.authenticated, PriceController.update);
router.get('/price/:id', md_auth.authenticated, PriceController.getPrice);
router.delete('/price/:id', md_auth.authenticated, PriceController.delete);
router.get('/prices', md_auth.authenticated, PriceController.getPrices);


module.exports = router;