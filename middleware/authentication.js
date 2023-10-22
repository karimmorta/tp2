'use strict';

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    // L'utilisateur est connecté
    if (req.user.admin) {
      // L'utilisateur est un administrateur
      res.locals.role = 'admin';
    } else {
      // L'utilisateur est un utilisateur connecté (non administrateur)
      res.locals.role = 'user';
    }
  } else {
    // L'utilisateur n'est pas connecté
    res.locals.role = 'guest';
  }
  next();
}

const isAdmin = (req, res, next) => {
  if (res.locals.role === 'admin') {
    // L'utilisateur est un administrateur
    return next();
  }
  console.warn('you are NOT an admin');
  res.render('error', { errorMessage: 'Vous devez être un admin pour effectuer cette action '})
}

module.exports = { isAuthenticated, isAdmin };