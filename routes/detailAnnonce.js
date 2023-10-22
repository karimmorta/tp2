const express = require('express');
const router = express.Router();
const AdModel = require('../models/add'); 
const QuestionReponseModel = require('../models/questionReponse');
const { getQuestionResponseDetails } = require('../services/questionAnswer');
const { isAuthenticated } = require('../middleware/authentication');

// Route pour afficher les détails d'une annonce en fonction de son ID
router.get('/detailAnnonce/:id',isAuthenticated, async (req, res) => {
    try {
        const adId = req.params.id;
        const annonce = await AdModel.findById(adId); // Recherchez l'annonce par ID dans la base de données
        if (!annonce) {
            return res.status(404).send('Annonce non trouvée'); // Gérez le cas où l'annonce n'est pas trouvée
        }

        const userLoggedIn = req.user;
        const questionResponseDetails = await getQuestionResponseDetails({ userLoggedIn, adId });
        const role = res.locals.role;
        console.log("role : ",role);
        console.log('On check une annonce:', { user: userLoggedIn })
        console.log('we are going to render questionResponseDetails:', questionResponseDetails);
        res.render('detailAnnonce', { annonce, questionResponseDetails ,role}); // Affichez les détails de l'annonce dans une vue EJS
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur serveur');
    }
});

router.get('detailAnnonce', async (req, res) => {
    res.render('detailAnnonce');
});

module.exports = router;