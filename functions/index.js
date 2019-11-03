const functions = require('firebase-functions');
const app = require('express')();
const auth = require('./utils/auth');

const { login, signup, getUserDetails } = require('./handlers/users');
const {
  postForm,
  getUserForms,
  getAllForms,
  deleteUserForm
} = require('./handlers/forms');

app.post('/signup', signup);
app.post('/login', login);

app.get('/users', auth, getUserDetails);
app.post('/forms', auth, postForm);
app.get('/forms', auth, getUserForms);
app.delete('/forms/:id', auth, deleteUserForm);
app.get('/allForms', getAllForms);

exports.api = functions.https.onRequest(app);
