const express = require('express');
const app = require('./app');

app.use(express.static('public'));
app.use('*', express.static('public/index.html'));

const port = process.env.PORT || 8000
app.listen(port, '0.0.0.0');
console.log(`Listening to ${port}`);
