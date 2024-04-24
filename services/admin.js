require('dotenv').config()
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

var dynamoDB = new AWS.DynamoDB.DocumentClient({
    region: "us-west-1",
});

var userCategoryTable = process.env.PROD_USER_CATEGORY;

exports.insertCategoryDetails = (body) => {
    var params = {
        TableName: userCategoryTable,
        Item: {
            id: uuidv4(),
            iconType: body.iconType,
            categoryName: body.categoryName,
            isActive: body.isActive,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }
    };

    return new Promise((res, rej) => {
        dynamoDB.put(params, function (err, data) {
            if (err) {
                rej(err);
            } else {
                res({
                    message: "Inserted category into Dynamodb !!!"
                });
            }
        });
    });
}

exports.getAllCategoryDetails = () => {
    var params = {
        TableName: userCategoryTable
    };

    return new Promise((resolve, reject) => {
        dynamoDB.scan(params, function (err, data) {
            if (err) {
                reject(err);
            } else {
                const filterData = filterCategory(data.Items);
                const sortedData = sortDataByCreatedAtDesc(filterData);
                resolve(sortedData);
            }
        })
    });
}

function filterCategory(categoryData) {
    return categoryData.filter(category => category.isActive);
}

function sortDataByCreatedAtDesc(data) {
    return data.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateA - dateB;
    });
}