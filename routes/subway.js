'use strict'

var express = require('express');
var SubwayController = require('../controllers/subway');

var router = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/subways' })

router.get('/test', SubwayController.test);
router.post('/subway', md_auth.authenticated, SubwayController.save);
router.get('/subways/:page?', md_auth.authenticated, SubwayController.getSubways);
router.get('/user-subways/:user', md_auth.authenticated, SubwayController.getSubwaysByUser);
router.get('/subway/:id', md_auth.authenticated, SubwayController.getSubway);
router.put('/subway/:id', md_auth.authenticated, SubwayController.update);
router.delete('/subway/:id', md_auth.authenticated, SubwayController.delete);
router.post('/upload-subway/:id', [md_auth.authenticated, md_upload], SubwayController.uploadSubway);
router.get('/subway-file/:fileName', md_auth.authenticated, SubwayController.getSubwayFile);
router.get('/search/:search', SubwayController.search);

module.exports = router;