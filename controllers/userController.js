const commitDetails = require('../services/customer')
const config = require('config');
const from = config.get('from');
const to = config.get('to');


exports.getTotalCommits = async(req, res) => {
  try {
    const allCommits = await commitDetails.getAllCommits(from, to);
    res.status(200).send(allCommits);
  } catch(err) {
    res.status(400).send({
      message: err
    })
  }
}

exports.getDashboardInformation = async(req, res) => {
  try {
    const totalGitHubAccount = 1;
    const totalRepository = 1;
    const totalCommits = await commitDetails.getAllCommits(from, to);
    const totalApprovedPR = 2;
    res.status(200).send({
      totalGitHubAccount : totalGitHubAccount,
      totalRepository: totalRepository,
      totalCommits: totalCommits.length,
      totalApprovedPR: totalApprovedPR
    });
  } catch(err) {
    res.status(400).send({
      message: err
    })
  }
}

exports.getCommitDetails = async(req, res) => {
  try {
      const commitid = req.query['commitid'];
      const result = await commitDetails.userCommitDetails(commitid);
      res.send(result)
  } catch(err) {
      res.status(400).send({
          error: err
      })
  }
}