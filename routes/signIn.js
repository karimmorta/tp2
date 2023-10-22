var express = require('express');
var router = express.Router();
const signIn = require('../controller/signInController')
const { isAuthenticated } = require('../middleware/authentication');
router.get('/register', isAuthenticated, signIn.signInReturn);
router.post('/register', signIn.createUser);

module.exports = router;
