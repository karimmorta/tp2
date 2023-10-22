const express = require('express');
const router = express.Router();
const passport = require('passport'); // Importez Passport
const login = require('../controller/loginController');
const { isAuthenticated } = require('../middleware/authentication');

router.get('/login',isAuthenticated, login.loginReturn);
router.get('/logout',isAuthenticated,login.logout);

router.post('/login', 
  (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.redirect('/login'); // L'authentification a échoué, redirigez vers /login
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        return next();
      });
    })(req, res, next);
  },
  (req, res) => {
    res.redirect('/');
  }
);


module.exports = router;
