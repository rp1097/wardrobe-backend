'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var dbConnection = require('./database/mongodb');
var config = require('./config/config');

var app = express();

app.use(cors());


app.use(bodyParser.json({ limit: '200mb' }));
app.use(bodyParser.urlencoded({ limit: '200mb', extended: true }));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "OPTIONS, GET, POST, PUT, PATCH, DELETE" // what matters here is that OPTIONS is present
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization", "Access-Control-Allow-Origin");
    next();
  });


require('./routes')(app);


const NODE_ENV = config.NODE_ENV;
const HOSTNAME = config.HOST;
const PORT = config.PORT;

app.listen(PORT, HOSTNAME, (req, resp) => {
    console.log(`${NODE_ENV} Server running at http://${HOSTNAME}:${PORT}/`);
})

module.exports = app;