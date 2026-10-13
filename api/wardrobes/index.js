var express = require('express');
var controller = require('./wardrobes.controller');

var router = express.Router();

router.post('/add', controller.add);
router.post('/update/:id', controller.update);
router.post('/list', controller.list);

module.exports = router;