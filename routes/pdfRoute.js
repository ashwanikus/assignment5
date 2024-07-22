var express = require('express');
const { readJsonFromS3, uploadPdfToS3 } = require('../config/aws');
const generatePDF = require('../utils/pdf');
const { v4: uuidv4 } = require('uuid'); // To generate unique identifiers
const dotenv = require('dotenv');
var router = express.Router();

router.get('/:key', async (req, res) => {
  const { key } = req.params;
  try {
    const jsonData = await readJsonFromS3(key);
    const pdfContent = await generatePDF(jsonData);
    const pdfKey = `user-${uuidv4()}-${new Date().toISOString()}.pdf`;
    await uploadPdfToS3(pdfKey, pdfContent);
    res.status(200).send({ message: 'PDF generated and uploaded to S3', pdfKey });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
