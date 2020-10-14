const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const PATH = require('path');
const login = require('../public/login.html');
const register = require('../public/register.html');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);


module.exports = router;