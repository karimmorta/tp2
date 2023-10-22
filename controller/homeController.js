const annonces = require('../models/add');
const { isAuthenticated } = require('../middleware/authentication');
const returnHome = async (req, res, next) => {
  try {
    // Récupérez toutes les annonces depuis la base de données
    const lesAnnonces = await annonces.find();
    let role = 'guest'; // Par défaut, le rôle est 'guest'

    if (req.isAuthenticated()) {
      // Si l'utilisateur est authentifié, mettez à jour le rôle
      role = res.locals.role;
    }

    console.log("role:", role);
    console.log(lesAnnonces); // Ajoutez cette ligne pour vérifier les annonces récupérées
    // Ajoutez le type à chaque annonce
    const annoncesAvecType = lesAnnonces.map((annonce) => ({
      ...annonce.toObject(),
      type: annonce.type === 'Location' ? 'Location' : 'Vendre',
    }));
    // Rendez la page d'accueil avec les annonces
    res.render('home', { lesAnnonces: annoncesAvecType, role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Une erreur est survenue lors de la récupération des annonces.' });
  }
};

module.exports = {
  returnHome
};

