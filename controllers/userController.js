exports.getDashboardInformation = async(req, res) => {
  try {
    
    res.status(200).send({message: "success !!!"});
  } catch(err) {
    res.status(400).send({
      message: err
    })
  }
}