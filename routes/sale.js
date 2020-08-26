'use strict'

var express = require('express');
var SaleController = require('../controllers/sale');

var router = express.Router();
var md_auth = require('../middlewares/authenticated');

router.post('/sale/subway/:subwayId', md_auth.authenticated, SaleController.add);
router.put('/sale/:saleId', md_auth.authenticated, SaleController.update);
router.delete('/sale/:subwayId/:saleId', md_auth.authenticated, SaleController.delete);

module.exports = router;