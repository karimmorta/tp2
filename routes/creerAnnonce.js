var express = require('express');
var router = express.Router();
const creerAnnonce = require('../controller/creerAnnonce');
const path = require('path');
const multer = require('multer');
const bien = require('../models/add');

const { isAuthenticated, isAdmin } = require('../middleware/authentication');

router.get('/rendueAnnonce', isAuthenticated, (req, res, next) => {
  if (req.user.admin) {
    // Si l'utilisateur est un administrateur, affichez la page de création d'annonce
    return creerAnnonce.renderanonce(req, res);
  } else {
    // Sinon, redirigez-le vers une page d'accès interdit ou affichez un message
    return res.status(403).send('Accès interdit : Vous n\'êtes pas un administrateur.');
  }
});

const dest = multer.diskStorage({
  destination: (req, file, c) => {
    c(null, path.join(process.cwd(), 'public', 'images'));
  },
  filename: (req, file, c) => {
    const suffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    c(null, suffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: dest });

router.post('/creeAnnonce', isAuthenticated, isAdmin, upload.array('photos', 5), async (req, res) => {
  try {
    // Vérifiez si l'utilisateur est un administrateur
    if (!req.user.admin) {
      return res.status(403).send('Accès interdit : Vous n\'êtes pas un administrateur.');
    }

    console.log('Création annonce:', req.body);
    const images = req.files.map((file) => {
      const photoUrl = '/images/' + file.filename;
      return {
        url: photoUrl,
        nomFichier: file.filename
      };
    });

    const bienDetails = new bien({
      titre: req.body.titre,
      type: req.body.type,
      statusPublication: req.body.statusPublication,
      statusBien: req.body.statusBien,
      description: req.body.description,
      prix: req.body.prix,
      dateAnnonce: req.body.dateAnnonce,
      photo: images,
    });

    await bienDetails.save();
    console.log("Annonce créée avec succès");
    res.redirect('/');
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

module.exports = router;