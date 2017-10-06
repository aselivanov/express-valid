const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const valid = require('express-valid');
const validator = require('validator');
const mongoose = require('mongoose');
const config = require('./config');

const app = express();

mongoose.connect('mongodb://mongo/example');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(valid());

app.get('/', function(req, res, next) {
  res.send('Hello');
});

app.post('/login', require('./rest/login'));
app.post('/signup', require('./rest/signup'));

app.listen(config.port, '0.0.0.0');
console.log(`Listening to ${config.port}`);
