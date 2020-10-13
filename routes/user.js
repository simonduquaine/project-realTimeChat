const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const PATH = require('path');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

router.get('/register', (req, res) => {
        res.sendFile('register.html', { root: PATH.join(__dirname, '/public') })
})

module.exports = router;