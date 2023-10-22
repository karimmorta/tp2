const User = require('../models/userModel');
const bcrypt = require('bcrypt');

const loginReturn = async (req, res) => {
     const role = res.locals.role;
     console.log("role2:", role);
    res.render('login', { role });
};

const loginfonction = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Recherche de l'utilisateur dans la base de données
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Utilisateur non trouvé.' });
        }

        // Vérification du mot de passe
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Mot de passe incorrect.' });
        }

        // Stocker des données dans la session
        req.session.userId = user._id;
        req.session.username = user.username;
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Une erreur est survenue lors de la connexion.' });
    }
};

const logout = (req, res) => {
    req.logout(err => {
        if (err) {
            res.status(500).send('Erreur lors de la déconnexion');
            return;
        }
        res.redirect("/login");
    });
};

module.exports = {
    loginReturn,
    loginfonction,
    logout
};
