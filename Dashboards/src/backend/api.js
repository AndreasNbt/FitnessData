const express = require('express');
const queryController = require('./queryController');

const router = express.Router();

// API route for querying data
router.post('/query', (req, res) => {
  queryController.queryData(req, res);
});

module.exports = router;