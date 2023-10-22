const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/authentication');
const QuestionReponseModel = require('../models/questionReponse');

const AdModel = require('../models/add'); 
const { getQuestionResponseDetails } = require('../services/questionAnswer');

router.post('/question-response/ask/:adId', isAuthenticated, async (req, res) => {
    try {
        const body = req.body;
        const adId = req?.params?.adId;
        const questionUser = req.user;

        console.debug('QUESTION Asked:', { adId, questionUser })
        if (!adId) {
            res.render('error', { errorMessage: 'No ad Id has been found'});
            return;
        }

        const newQuestion = new QuestionReponseModel({
            name: body.name,
            firstName: body.firstName,
            questionSentence: body.questionSentence,
            adId,
            questionUserId: questionUser._id,
        })
        newQuestion.save();
        res.redirect(`/detailAnnonce/${adId}`);
        const annonce = await AdModel.findById(adId); // Recherchez l'annonce par ID dans la base de données
        if (!annonce) {
            return res.status(404).send('Annonce non trouvée'); // Gérez le cas où l'annonce n'est pas trouvée
        }
        
        const questionResponseDetails = await getQuestionResponseDetails({ userLoggedIn: questionUser, adId })
        console.log('une question a été créé', { name: body.name })
        res.render('detailAnnonce', { annonce, questionResponseDetails });
        
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'On ne peut pas créer cette question' });
    }
});


router.post('/question-response/answer/:questionId', isAuthenticated, async (req, res, next) => {
    try {
        console.log('ANSWERING RIGHT NOW:', { body: req.body })
        const body = req.body;
        const questionId = req?.params?.questionId;
        const questionUser = req.user;
        
        await QuestionReponseModel.findByIdAndUpdate(questionId, { 
            responseSentence: body.answer,
            agentName: questionUser.nom || 'unknown',
        });

        res.redirect(`/`);

    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Cette question ne peut pas être répondu' });
    }
});


module.exports = router;
