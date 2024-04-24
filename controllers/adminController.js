const adminService = require('../services/admin')

exports.createCategory = async(req, res) => {
    try {
        const { body } = req;
        const insertCategory = await adminService.insertCategoryDetails(body);
        res.send(insertCategory);
    } catch(err) {
        res.status(400).send({
            error: err
        })
    }
}

exports.getAllCategory = async(req, res) => {
    try {
        const getAllCategory = await adminService.getAllCategoryDetails();
        res.send(getAllCategory);
    } catch(err) {
        res.status(400).send({
            error: err
        })
    }
}