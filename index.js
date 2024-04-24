require('aws-sdk/lib/maintenance_mode_message').suppress = true;
const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const config = require('config');


const app = express();

app.use(cors())
app.options('*', cors());

app.use(bodyparser.json({limit: config.get('maximumSizeDataTransfer'), extended: true}))
app.use(bodyparser.urlencoded({limit: config.get('maximumSizeDataTransfer'), extended: true}))

const authRoutes = require('./routes/authRoutes');
const apiRoutes = require('./routes/routes');


app.use('/auth', authRoutes);
app.use('/api', apiRoutes);



//Capture All 404 errors
app.use(function (req,res,next){
	res.status(404).send('Error - Unable to find the requested resource!');
});

app.use((req, res, next) => {
  req.socket.on('error', () => {});
  next();
});


const server = app;

module.exports = server;