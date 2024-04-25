const dataBase = require('../elasticdb');

// Elasticsearch Index Name
const indexName = process.env.PROD_COMMIT_REVIEWS_ELASTICSEARCH_INDEX;

exports.getAllCommits = (from, size) => {
    return new Promise((resolve, reject) => {
        dataBase.elasticsearch.search({
           index: indexName,
           
           body: {
               "from" : from, "size" : size,
                 query: {
                    bool: {
                       must: []
                    }
              },
            //   sort: [
            //      {
            //         "createdAt": {
            //            "order": "desc"
            //         }
            //      }
            //   ]
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

exports.userCommitDetails = (commitId) => {
   return new Promise((resolve, reject) => {
      dataBase.elasticsearch.get({
         index: indexName,
         id: commitId,
      }).then(function (response) {
         var hits = response._source;
         resolve(hits);
      }, function (error) {
         console.trace(error.message)
         reject(error.message)
      }).catch((err) => {
         console.log("Elasticsearch ERROR - data not fetched", err);
      }) 
   })
 }