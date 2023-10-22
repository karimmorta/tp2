const mongoose = require('mongoose');
require("dotenv").config();

const connectDB = async() =>
    await mongoose.connect(process.env.DB,{//Connection à la base de donnée (utilisation du fichier .env )
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    ).then(()=>{
        console.log("Connexion à la base de donnée réussie !");
    }).catch((error)=>{
        console.log(error);
    });

module.exports=connectDB