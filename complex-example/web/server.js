const express = require('express');

const app = express();

app.use(express.static('public'));
app.use('*', express.static('public/index.html')); // fallback

const port = process.env.SERVER_PORT || 80;
app.listen(port, '0.0.0.0');
console.log(`Listen to ${port}`);