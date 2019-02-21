const express = require('express');
const multer = require('multer');
const processHandler = require('./processHandler');

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: '10MB'
  }
});

router.get('/', function (req, res, next) {
  res.render('index');
});

router.post('/api/process', upload.single('original'), processHandler);

module.exports = router;
