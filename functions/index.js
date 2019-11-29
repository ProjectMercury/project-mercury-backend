const functions = require('firebase-functions');
const app = require('express')();
const auth = require('./utils/auth');
const cors = require('cors');
app.use(cors());

const { login, signup, getUserDetails } = require('./handlers/users');
const {
  postForm,
  getUserForms,
  getAllForms,
  deleteUserForm,
  addResponse,
  getFormResponses,
  getFormById,
  getTotalResponses
} = require('./handlers/forms');

app.post('/signup', signup);
app.post('/login', login);

app.get('/users', auth, getUserDetails);
app.post('/forms', auth, postForm);
app.get('/forms', auth, getUserForms);
app.get('/forms/:id', getFormById);
app.delete('/forms/:id', auth, deleteUserForm);
app.get('/allForms', getAllForms);
app.post('/forms/:id/responses', addResponse);
app.get('/forms/:id/responses', getFormResponses);
app.get('/forms/responses/count', auth, getTotalResponses);

exports.api = functions.https.onRequest(app);
