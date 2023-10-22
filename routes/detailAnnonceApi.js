const express = require('express');
const router = express.Router();
const AdModel = require('../models/add'); 
const QuestionReponseModel = require('../models/questionReponse');
const { getQuestionResponseDetails } = require('../services/questionAnswer');
const { isAuthenticated } = require('../middleware/authentication');

// Route pour afficher les détails d'une annonce en fonction de son ID
router.get('/api/detailAnnonce/:id', async (req, res) => {
    try {
        const adId = req.params.id;
        const annonce = await AdModel.findById(adId); // Recherchez l'annonce par ID dans la base de données
        if (!annonce) {
            return res.status(404).send('Annonce non trouvée'); // Gérez le cas où l'annonce n'est pas trouvée
        }

        res.json(annonce)
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur serveur');
    }
});

router.get('detailAnnonce', async (req, res) => {
    res.render('detailAnnonce');
});

module.exports = router;