const functions = require('firebase-functions');
const app = require('express')();

const { login, signup } = require('./handlers/users');

app.post('/signup', signup);
app.post('/login', login);

exports.api = functions.https.onRequest(app);
