//Le schéma de l'utilisateur
let mongoose = require ('mongoose');
let Schema = mongoose.Schema;

let userSchema = new Schema({
        nom: {
            type : String,
            unique: true,
            required: true,
        },
        prenom: {
            type : String,
            unique: true,
            required: true,
        },
        email : {
            type : String,
        },
        password : {
            type : String,
            minlength: 6,
            required: true,
        },
         admin: Boolean
      });


module.exports = mongoose.model('userSchema',userSchema);