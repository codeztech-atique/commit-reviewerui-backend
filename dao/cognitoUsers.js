
const AmazonCognitoId = require('amazon-cognito-identity-js');
const constants = require('../constants/userCustomAttributes');

exports.daoUserAttributes = (body) => {
    // Create / Update User Custom Attributes
    var customAttributeList = [];
    
    if(body.name) {
        var userName = new AmazonCognitoId.CognitoUserAttribute(constants.userName(body.name));
        customAttributeList.push(userName);
    }

    if(body.role) {
        var userRole = new AmazonCognitoId.CognitoUserAttribute(constants.userRole(body.role));
        customAttributeList.push(userRole);
    }

    if(body.gender) {
        var userGender = new AmazonCognitoId.CognitoUserAttribute(constants.userGender(body.gender));
        customAttributeList.push(userGender);
    }

    if(body.profile) {
        var userRole = new AmazonCognitoId.CognitoUserAttribute(constants.userProfile(body.profile));
        customAttributeList.push(userRole);
    }

    if(body.email) {
        var userEmail = new AmazonCognitoId.CognitoUserAttribute(constants.userEmail(body.email));
        customAttributeList.push(userEmail);
    }

    if(!body.createdAt) {
        var userCreatedAt = new AmazonCognitoId.CognitoUserAttribute(constants.userCreatedAt(new Date().toISOString()));
        customAttributeList.push(userCreatedAt);
    }

    if(!body.updatedAt) {
        var userUpdatedAt = new AmazonCognitoId.CognitoUserAttribute(constants.userUpdatedAt(new Date().toISOString()));
        customAttributeList.push(userUpdatedAt);
    }
    
    return customAttributeList;
}