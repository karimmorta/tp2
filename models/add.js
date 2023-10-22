let mongoose = require ('mongoose');
let Schema = mongoose.Schema;

let adSchema = new Schema({
    titre: {
        type: String
    },
    type: {
        type: String
    },
    statusPublication: {
        type: String
    },
    statusBien: {
        type: String
    },
    description: {
        type: String
    },
    prix: {
        type: Number
    },
    dateAnnonce: {
        type: Date, 
        required: true 
    },
    photo: [
        {
            url: { type: String, required: true },
            nomFichier: { type: String, required: true }
        }
    ]
});

module.exports = mongoose.model('adSchema', adSchema);
