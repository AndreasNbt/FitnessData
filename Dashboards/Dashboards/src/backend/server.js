const express = require('express');
const cors = require('cors');
const apiRoutes = require('./api');

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api', apiRoutes);

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
