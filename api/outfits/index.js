var express = require('express');
var controller = require('./outfits.controller');

var router = express.Router();

router.post('/uploadImg',  controller.uploadMiddleware, controller.uploadImg);
router.post('/add', controller.add);
router.post('/update/:id', controller.update);
router.post('/delete/:id', controller.delete);
router.post('/list', controller.list);

module.exports = router;