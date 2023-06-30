const config = require('./db');
const SparqlClient = require('sparql-http-client/SimpleClient');

// Query RDF data from GraphDB
exports.queryData = async (req, res) => {
  const query = req.body.query;
  const client = new SparqlClient({ endpointUrl: config.endpoint });
    
  try {
    const response = await client.query.select(query);
    const results = await response.json();

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred during the query execution.' });
  }
};
