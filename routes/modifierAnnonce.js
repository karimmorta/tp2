// module.exports = router;
const express = require('express');
const router = express.Router();
const adModel = require('../models/add');
const multer = require('multer');
const path = require('path');
const { isAuthenticated, isAdmin } = require('../middleware/authentication');

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

// Route pour afficher le formulaire de modification
router.get('/modifierAnnonce/:id', isAuthenticated, (req, res, next) => {
  if (req.user.admin) {
    // Si l'utilisateur est un administrateur, continuez avec la route
    return next();
  } else {
    // Sinon, redirigez-le vers une page d'accès interdit ou affichez un message
    return res.status(403).send('Accès interdit : Vous n\'êtes pas un administrateur.');
  }
}, async (req, res) => {
  try {
    console.log('Getting annonce', req?.params?.id);
    const annonce = await adModel.findById(req.params.id).exec();
    console.log('On a une annonce', annonce);
    
    res.render('modifierAnnonce', { annonce });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur de serveur');
  }
});

// Route pour traiter la soumission du formulaire de modification
router.post('/modifierAnnonce/:id', isAuthenticated, isAdmin, upload.array("newPhotos", 5), async (req, res) => {
  try {
    const updateAnnonce = req.body;

    const newImages = req.files.map((file) => {
      const photoUrl = '/images/' + file.filename;
      return {
        url: photoUrl,
        nomFichier: file.filename
      };
    });

    console.log('Données de l\'annonce mise à jour :', { paramsId: req.params.id, updateAnnonce, newImages });

    const updateObject = updateAnnonce;

    if (updateAnnonce && updateAnnonce.imageIdsToDelete) {
      const updatedOne = await adModel.updateOne({ _id: req.params.id }, { $pull: { photo: { _id: { $in: updateAnnonce.imageIdsToDelete } } } });
      console.log('updated:', updatedOne.modifiedCount);
    }

    if (updateAnnonce && newImages?.length) {
      
      console.log('pushing some images:', { length: newImages.length })
      const updatedOne = await adModel.updateOne({ _id: req.params.id }, {
        $push: {
          photo: {
            $each: newImages
          }
        }
      });
      console.log('updated:', updatedOne.modifiedCount);
    }

    await adModel.findByIdAndUpdate(req.params.id, updateObject).exec();
    // Rediriger vers la page d'affichage de l'annonce modifiée
    res.redirect(`/detailAnnonce/${req.params.id}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur de serveur');
  }
});

module.exports = router;