const express = require('express');
const bodyParser = require('body-parser');
const valid = require('express-valid');

const app = express();

// mongoose.connect('mongodb://mongo/example');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(valid());

app.get('/', function(req, res, next) {
  res.send('Hello');
});

app.post('/profiles', require('./rest/profiles').post);

module.exports = app;