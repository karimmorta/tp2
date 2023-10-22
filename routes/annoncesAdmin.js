const express = require('express');
const router = express.Router();
const annonces = require('../models/add'); 
const { isAuthenticated, isAdmin } = require('../middleware/authentication');

// Route pour afficher les annonces avec bouton de suppression
router.get('/annoncesAdmin', isAuthenticated, isAdmin, async (req, res) => {
    try {
        // Récupérez la liste des annonces depuis votre base de données (
        const lesAnnonces = await annonces.find();

        
        res.render('annoncesAdmin', { annonces: lesAnnonces }); 
    } catch (error) {
        
        console.error(error);
        res.status(500).send('Erreur de serveur');
    }
});

module.exports = router;