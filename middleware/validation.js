const chalk = require('chalk');
const { getSubscriptionDate } = require('../utils/index')

// Validate API
exports.validateLoginUserAPI = (req, res, next) => {
  // console.log();
  // console.log(chalk.bgYellowBright("---------------- Validated API Data ----------------"));
  var error = '';
  if (req.body.email === undefined || req.body.email === '') {
    console.log(chalk.red('email is missing'));
    error += "email, "
  }
  if (req.body.password === undefined || req.body.password === '') {
    console.log(chalk.red('password is missing'));
    error += "password, "
  }
  if (error !== '') {
    res.status(400).send({
      status: 400,
      message: error + ' is required !!!'
    });
  } else {
    next();
  }
};

exports.validateConfirmPasswordAPI = (req, res, next) => {
  // console.log();
  // console.log(chalk.bgYellowBright("---------------- Validated API Data ----------------"));
  
  var error = '';

  if (req.body.id === undefined || req.body.id === '') {
    console.log(chalk.red('id is missing'));
    error += "id, "
  } 
  if (req.body.email === undefined || req.body.email === '') {
    console.log(chalk.red('email is missing'));
    error += "email, "
  }
  if (req.body.password === undefined || req.body.password === '') {
    console.log(chalk.red('password is missing'));
    error += "password, "
  } 
  if (req.body.code === undefined || req.body.code === '') {
    console.log(chalk.red('verificationCode is missing'));
    error += "verificationCode, "
  }
  
  if (error !== '') {
    res.status(400).send({
      status: 400,
      message: error + ' is required !!!'
    });
  } else {
    next();
  }
};

exports.validateLogoutUserAPI = (req, res, next) => {
  // console.log();
  // console.log(chalk.bgYellowBright("---------------- Validated API Data ----------------"));
  var error = '';
  if (req.body.id === undefined || req.body.id === '') {
    console.log(chalk.red('id is missing'));
    error += "id, "
  }
  if (req.body.userId === undefined || req.body.userId === '') {
    console.log(chalk.red('userId is missing'));
    error += "userId, "
  }
  if (req.body.email === undefined || req.body.email === '') {
    console.log(chalk.red('email is missing'));
    error += "email, "
  }
  if (error !== '') {
    res.status(400).send({
      status: 400,
      message: error + ' is required !!!'
    });
  } else {
    next();
  }
};


exports.validateRegisterUserAPI = (req, res, next) => {
  // console.log();
  // console.log(chalk.bgYellowBright("---------------- Validated API Data ----------------"));
  var error = '';
  const subscriptionDate = getSubscriptionDate();
  const subscriptionStartDate = subscriptionDate.subscriptionStartDate;
  const subscriptionEndDate = subscriptionDate.subscriptionEndDate;

  if (req.body.name === undefined || req.body.name === '') {
    let userName = req.body.email.split("@");
    req.body.name = userName[0];
  }

  if (req.body.email === undefined || req.body.email === '') {
    console.log(chalk.red('email is missing'));
    error += "email, "
  }
  if (req.body.password === undefined || req.body.password === '') {
    console.log(chalk.red('password is missing'));
    error += "password, "
  }

  if (error !== '') {
    res.status(400).send({
      status: 400,
      message: error + ' is required !!!'
    });
  } else {
    next();
  }
};

exports.validateChangePasswordAPI = (req, res, next) => {
  // console.log();
  // console.log(chalk.bgYellowBright("---------------- Validated API Data ----------------"));
  var error = '';
  req.body.newpassword = req.body.password;
  if (req.body.email === undefined || req.body.email === '') {
    console.log(chalk.red('email is missing'));
    error += "email, "
  }
  if (req.body.password === undefined || req.body.password === '') {
    console.log(chalk.red('password is missing'));
    error += "password, "
  }

  if (error !== '') {
    res.status(400).send({
      status: 400,
      message: error + ' is required !!!'
    });
  } else {
    next();
  }
};

exports.validateVerifyTokenAPI = (req, res, next) => {
  // console.log();
  // console.log(chalk.bgYellowBright("---------------- Validated API Data ----------------"));
  var error = '';
  if (req.body.token === undefined || req.body.token === '') {
    console.log(chalk.red('token is missing'));
    error += "token, "
  }

  if (error !== '') {
    res.status(400).send({
      status: 400,
      message: error + ' is required !!!'
    });
  } else {
    next();
  }
};

exports.validateVerifyEmailAPI = (req, res, next) => {
  // console.log();
  // console.log(chalk.bgYellowBright("---------------- Validated API Data ----------------"));
  var error = '';
  if (req.body.id === undefined || req.body.id === '') {
    console.log(chalk.red('id is missing'));
    error += "user, "
  }
  if (req.body.code === undefined || req.body.code === '') {
    console.log(chalk.red('code is missing'));
    error += "code, "
  }
  if (error !== '') {
    res.status(400).send({
      status: 400,
      message: error + ' is required !!!'
    });
  } else {
    next();
  }
};

exports.validateRenewTokenAPI = (req, res, next) => {
  // console.log();
  // console.log(chalk.bgYellowBright("---------------- Validated API Data ----------------"));
  var error = '';
  if (req.body.email === undefined || req.body.email === '') {
    console.log(chalk.red('email is missing'));
    error += "email, "
  }
  if (req.body.token === undefined || req.body.token === '') {
    console.log(chalk.red('token is missing'));
    error += "token, "
  }
  if (error !== '') {
    res.status(400).send({
      status: 400,
      message: error + ' is required !!!'
    });
  } else {
    next();
  }
};

exports.validateVerifyCodeAPI = (req, res, next) => {
  // console.log();
  // console.log(chalk.bgYellowBright("---------------- Validated API Data ----------------"));
  var error = '';
  if (req.body.user === undefined || req.body.user === '') {
    console.log(chalk.red('user is missing'));
    error += "user, "
  }
  if (req.body.code === undefined || req.body.code === '') {
    console.log(chalk.red('code is missing'));
    error += "code, "
  }
  if (error !== '') {
    res.status(400).send({
      status: 400,
      message: error + ' is required !!!'
    });
  } else {
    next();
  }
};

// Chargebee user validation
exports.validateUserSubscriptionData = (req, res, next) => {
  // console.log();
  // console.log(chalk.bgYellowBright("---------------- Validated API Data ----------------"));
  var error = '';
  if (req.body.email === undefined || req.body.email === '') {
    console.log(chalk.red('email is missing'));
    error += "email, "
  }
  if (req.body.name === undefined || req.body.name === '') {
    console.log(chalk.red('name is missing'));
    error += "name, "
  }
  if (error !== '') {
    res.status(400).send({
      status: 400,
      message: error + ' is required !!!'
    });
  } else {
    next();
  }
};

