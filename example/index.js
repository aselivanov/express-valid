var express = require('express');
var bodyParser = require('body-parser');
var valid = require('express-valid');
var validator = require('validator');
var mongoose = require('mongoose');
var app = express();

mongoose.connect('mongodb://mongo/example');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(valid({
  otherwise: function (req, res, errors) {
    res.status(400).send({
      errors: errors
    });
  }
}));

app.get('/', function(req, res, next) {
  res.send('Hello');
});

app.post('/signup', require('./api/signup'));

app.listen(8000, '0.0.0.0');
console.log('Listeninig');
