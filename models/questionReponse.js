//Le schéma de l'annonce
const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const questionReponseSchema = new Schema({
    name: {
        type: String
    },
    firstName: {
        type: String
    },
    questionSentence:{
        type: String
    },
    questionUserId: {
        type: mongoose.ObjectId
    },
    adId: {
        type: mongoose.ObjectId
    },
    responseSentence: {
        type:String
    },
    agentName:{
        type: String
    },
});

module.exports = mongoose.model('questionReponseSchema',questionReponseSchema);