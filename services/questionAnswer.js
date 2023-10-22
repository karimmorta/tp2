
const QuestionReponseModel = require('../models/questionReponse');

const getQuestionResponseDetails = async({ userLoggedIn, adId }) => {

    const questionResponseDetails = {
        items: [],
        questionAllowed: false,
    };


    if (userLoggedIn){
        if (userLoggedIn.admin){
            // WHEN ADMIN:

            const foundQuestions = await QuestionReponseModel.find({ 
                adId 
            });
            
            if (foundQuestions?.length){
                questionResponseDetails.items = foundQuestions
            }

        } else {
            // when CLIENT USER:
            const foundQuestion = await QuestionReponseModel.findOne({ 
                questionUserId: userLoggedIn._id,
                adId 
            });
            

            if (!foundQuestion){
                questionResponseDetails.questionAllowed = true
            } else {
                questionResponseDetails.items = [foundQuestion]
            }
            
        }
    }

    return questionResponseDetails;
}

module.exports = { getQuestionResponseDetails };