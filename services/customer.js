require('dotenv').config();
const dataBase = require('../elasticdb');
const axios = require('axios')
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
      }).then(async function (response) {
         var hits = response._source;
         var gitGithubComments = await getGitHubComments(hits.commitId, hits.repoName);
         hits['comments'] = gitGithubComments[0].body;
         resolve(hits);
      }, function (error) {
         console.trace(error.message)
         reject(error.message)
      }).catch((err) => {
         console.log("Elasticsearch ERROR - data not fetched", err);
      }) 
   })
}

const getGitHubComments = async (commitId, repoName) => {
   const repoOwner = repoName.split('/')[0];  // Gets the owner
   const repo = repoName.split('/')[1];      // Gets the repository name
   const url = `https://api.github.com/repos/${repoOwner}/${repo}/commits/${commitId}/comments`;
   try {
       const response = await axios.get(url, {
           headers: { 'Authorization': `token ${process.env.GITHUB_TOKEN}` }
       });
       return response.data;
   } catch (error) {
       console.error('Failed to fetch GitHub comments:', error.message);
       return []; // Return empty array or handle error as needed
   }
};
