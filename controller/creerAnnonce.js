const bien = require('../models/add'); 
const renderanonce = async (req, res, next) => {
  res.render('pageAnnonce');
};


module.exports = {
  //creerAnnonce,
  renderanonce,
};
