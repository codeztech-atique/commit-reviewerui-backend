const { Client } = require('@elastic/elasticsearch');

// Elasticsearch Configuration
const cloudId = process.env.PROD_ELASTIC_SEARCH_CLOUD_ID;
const userName = process.env.PROD_ELASTIC_SEARCH_USERNAME;
const password = process.env.PROD_ELASTIC_SEARCH_PASSWORD;

exports.elasticsearch = new Client({
    cloud: {
      id: cloudId,
    },
    auth: {
        username: userName,
        password: password
    }
})
