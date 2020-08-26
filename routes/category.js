'use strict'

var express = require('express');
var CategoryController = require('../controllers/category');

var router = express.Router();
var md_auth = require('../middlewares/authenticated');

router.post('/category', md_auth.authenticated, CategoryController.save);
router.put('/category/:id', md_auth.authenticated, CategoryController.update);
router.get('/category/:id', md_auth.authenticated, CategoryController.getCategory);
router.delete('/category/:id', md_auth.authenticated, CategoryController.delete);
router.get('/categories', md_auth.authenticated, CategoryController.getCategories);


module.exports = router;