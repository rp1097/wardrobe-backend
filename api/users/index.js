var express = require('express');
var controller = require('./users.controller');

var router = express.Router();

router.post('/register', controller.register);
router.post('/login', controller.login);
router.post('/list', controller.list);
router.post('/update/:id', controller.update);
router.delete('/delete/:id', controller.delete);
router.get('/user/:id', controller.details);
router.post('/forgotPassword', controller.forgotPassword);
router.post('/searchUsers', controller.searchUsers);

module.exports = router;