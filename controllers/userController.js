const commitDetails = require('../services/customer')

exports.getDashboardInformation = async(req, res) => {
  try {
    const allCommits = await commitDetails.getAllCommits();
    res.status(200).send(allCommits);
  } catch(err) {
    res.status(400).send({
      message: err
    })
  }
}