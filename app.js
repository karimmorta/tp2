var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const passport = require('passport');
const secret = require('./config/generekey'); 
var createError = require('http-errors');
const bodyParser = require('body-parser');
const router = express.Router();



const adminMiddleware = require('./middleware/authentication');
// Importez Passport et le fichier de configuration
require('./config/passport-config'); // Assurez-vous d'importer correctement le fichier de configuration

var login = require('./routes/login');
var home = require('./routes/home');
var signIn = require('./routes/signIn');
var creerAnnonce = require('./routes/creerAnnonce');

const detailAnnonce = require('./routes/detailAnnonce');

const annoncesAdminRouter = require('./routes/annoncesAdmin'); 
const supprimerAnnonceRouter = require('./routes/supprimerAnnonce');
const modifierAnnonceRouter = require('./routes/modifierAnnonce');
const questionReponseRouter = require('./routes/questionReponse');

const annoncesAdminApiRouter = require('./routes/api/annoncesAdminApi');
const detailAnnonceApiRouter = require('./routes/api/detailAnnonceApi');

const apiDocsRouter = require('./routes/apiDocs');

//require("dotenv").config();
var app = express();

// Configuration de la session
app.use(
  session({
    secret:'r8q,+&1LM3)CD*zAGpx1xm{NeQhc;#' , // Clé secrète pour signer les cookies de session
    resave: false, // Ne pas enregistrer la session si elle n'a pas été modifiée
    saveUninitialized: true, // Enregistrer une nouvelle session même si elle est vide
    cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
  })
);

// Initialisation de Passport
app.use(passport.initialize());
app.use(passport.session());

// Connexion à la base de données
var db = require('./database/database');
db();

// Configuration du moteur de vue
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware pour les fichiers statiques
app.use('/css/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use(express.static(path.join(__dirname, 'public')));

// Middleware de journalisation
app.use(logger('dev'));


// Middleware pour analyser les requêtes JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware pour les cookies
app.use(cookieParser());
app.use((req, res, next) => {
  if (req.session) {
      res.locals.message = req.session.message;
      delete req.session.message;
  }
  next();
});
// Middleware pour passer la variable admin à toutes les vues
app.use((req, res, next) => {
  if (req.isAuthenticated()) {
    res.locals.admin = req.user.admin;
  } else {
    res.locals.admin = false; // Vous pouvez également définir admin à false si l'utilisateur n'est pas authentifié
  }
  next();
});
// Routes WebApp
app.use('', login);
app.use('', home);
app.use('', signIn);
app.use('', creerAnnonce);
app.use('', detailAnnonce);
app.use('', annoncesAdminRouter);  
app.use('', supprimerAnnonceRouter);
app.use('', modifierAnnonceRouter);
app.use('', questionReponseRouter);

// Routes API
app.use('', annoncesAdminApiRouter)
app.use('', detailAnnonceApiRouter)

// Routes Swagger
app.use('', apiDocsRouter)

// Middleware pour déterminer si l'utilisateur est connecté et/ou est admin

// Gestion des erreurs 404 et 500
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', { errorMessage: res.locals.message || 'unknown error'});
});

// Lancement de votre application Express
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});

module.exports = app;
