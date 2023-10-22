const express = require('express');
const router = express.Router();
const Annonce = require('../models/add'); 
const { isAuthenticated, isAdmin } = require('../middleware/authentication');

// Route pour supprimer une annonce en fonction de son ID
router.get('/supprimerAnnonce/:id', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const annonceId = req.params.id;
        // Vérifier si l'utilisateur est administrateur
        if (!req.user || !req.user.admin) {
            // Si l'utilisateur n'est pas administrateur, affichez un message d'accès interdit
            return res.status(403).send('Accès interdit : Vous devez être administrateur pour accéder à cette page.');
        }
        // Supprimez l'annonce en fonction de son ID
        await Annonce.findByIdAndRemove(annonceId);
        res.redirect('/'); // Redirigez l'utilisateur vers la page annoncesAdmin après la suppression
    } catch (error) {
        
        console.error(error);
        res.status(500).send('Erreur de serveur');
    }
});

module.exports = router;