const bcrypt = require('bcrypt');
const User=require("../models/userModel")
const { isAuthenticated } = require('../middleware/authentication');
const signInReturn =  async (req, res) => {
    const role = res.locals.role; // Obtenez le rôle de l'utilisateur
    res.render('signIn', { role });
  };
  
  const createUser = async (req, res) => {
    try {
        // Récupérer les données du formulaire
        const { nom, prenom, email, password } = req.body;

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'L\'utilisateur existe déjà.' });
        }

        // Hacher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Créer un nouvel utilisateur
        const newUser = new User({ nom, prenom, email, password: hashedPassword , admin:false});
        
        // Enregistrer l'utilisateur dans la base de données
        await newUser.save();
        res.redirect('/');

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Une erreur est survenue lors de l\'inscription.' });
    }
  }
  module.exports = {
    signInReturn,
    createUser
}
