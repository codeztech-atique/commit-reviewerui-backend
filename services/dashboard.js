const dataBase = require('../elasticdb');

// Elasticsearch Index Name
const indexName = process.env.PROD_COMMIT_REVIEWS_ELASTICSEARCH_INDEX;

exports.getTotalUserRequest = (userId, from, size) => {
    return new Promise((resolve, reject) => {
        dataBase.elasticsearch.search({
           index: indexName,
           
           body: {
               "from" : from, "size" : size,
                 query: {
                    bool: {
                       must: [
                          {
                                match: {
                                   "userid": userId,
                                }
                          },
                          { 
                             range : {
                                "currentStatus.stepNo": {
                                   "lte": 5
                                }
                             }
                          },
                       ]
                    }
              },
              sort: [
                 {
                    "createdAt": {
                       "order": "desc"
                    }
                 }
              ]
           }
        }).then(function (response) {
           var hits = response.hits.hits;
           resolve(hits);
        }, function (error) {
           console.trace(error.message)
           reject(error.message)
        }).catch((err) => {
           console.log("Elasticsearch ERROR - data not fetched", err);
        }) 
     });
}