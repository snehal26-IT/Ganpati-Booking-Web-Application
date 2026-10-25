const express = require('express');
const router = express.Router();
const { getIdols, getIdolById } = require('../controllers/idolController');

router.get('/', getIdols);
router.get('/:id', getIdolById);

module.exports = router;
