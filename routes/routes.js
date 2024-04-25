const express = require('express');
const bodyParser = require('body-parser');
const app = express();


app.use(bodyParser.json());

// Authentication
const authentication = require('../authentication');

// Middleware
const middleware = require('../middleware/headerValidation');

// Permission
const permissions = require('../permission/index')

// Controller
const adminController = require('../controllers/adminController');
const userController = require('../controllers/userController');

// Sample API testing without bearerTokenPresent
app.get('/', (req, res) => {
   res.status(200).send({
      message:'App is working fine!'
   });
});

// Test API with bearerTokenPresent
app.post('/test', [middleware.bearerTokenPresent, authentication.loggedInUserVerifyToken, authentication.verifyRole_Email], (req, res) => {
   res.send({
      status: 200,
      message: "Test Success !!!"
   })
});

// Dashboard API
app.get('/dashboard', [middleware.bearerTokenPresent, authentication.loggedInUserVerifyToken, permissions.commonPermission], (req, res) => {
   userController.getDashboardInformation(req, res);
})

app.get('/total-commits', [middleware.bearerTokenPresent, authentication.loggedInUserVerifyToken, permissions.customerPermission], (req, res) => {
   userController.getTotalCommits(req, res);
})

app.get('/details', [middleware.bearerTokenPresent, authentication.loggedInUserVerifyToken, permissions.commonPermission], (req, res) => {
   userController.getCommitDetails(req, res);
});

module.exports = app;
