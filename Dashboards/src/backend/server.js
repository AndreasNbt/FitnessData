const express = require('express');
const cors = require('cors');
const apiRoutes = require('./api');

// Create an instance of Express
const app = express();

// Set up middleware
app.use(express.json());
app.use(cors());

// Set up API routes
app.use('/api', apiRoutes);

// Set up server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
