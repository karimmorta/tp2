var express = require('express');
var router = express.Router();

const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
// Initialize swagger-jsdoc -> returns validated swagger spec in json format
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Docs',
      version: '1.0.0',
    },
  },
  apis: ['./routes/api/detailAnnonceApi.js'], // files containing annotations as above
};
const swaggerSpec = swaggerJSDoc(options);
; 
/* GET home page. */
router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(swaggerSpec));


module.exports = router;
