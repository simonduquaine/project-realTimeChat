const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const PATH = require('path');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth')

router.post('/register', userCtrl.signup);
router.post('/login', userCtrl.login);

router.get('/register', (req, res) => {
        res.sendFile('register.html', { root: PATH.join(__dirname, '/../public') })
})

router.get('/', (req, res) => {
        res.sendFile('login.html', { root: PATH.join(__dirname, '/../public') })
})

router.get('/chat', (req, res) => {
        res.sendFile('index.html', { root: PATH.join(__dirname, '/../public') })
})

module.exports = router;
