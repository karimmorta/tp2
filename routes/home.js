var express = require('express');
var router = express.Router();
const home = require('../controller/homeController')
const { isAuthenticated } = require('../middleware/authentication'); 
/* GET home page. */
router.get('',isAuthenticated , home.returnHome)


module.exports = router;
