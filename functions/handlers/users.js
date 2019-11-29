const { db } = require('../utils/admin');
const config = require('../utils/config');

const firebase = require('firebase');
firebase.initializeApp(config);

const {
  validateSignupData,
  validateLoginData
} = require('../utils/validators');

//Route for Signup
exports.signup = (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    username: req.body.username
  };

  const { valid, errors } = validateSignupData(newUser);

  if (!valid) return res.status(400).json(errors);

  let tokenItem, userId;
  return db
    .doc(`/users/${newUser.username}`)
    .get()
    .then(doc => {
      if (doc.exists) {
        return res.status(400).json({ username: 'username is taken already' });
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password);
      }
    })
    .then(data => {
      userId = data.user.uid;
      return data.user.getIdToken(true);
    })
    .then(token => {
      tokenItem = token;
      const userCredentials = {
        username: newUser.username,
        email: newUser.email,
        created: new Date().toISOString(),
        userId
      };
      return db.doc(`/users/${newUser.username}`).set(userCredentials);
    })
    .then(() => {
      return res.status(201).json({ token: tokenItem });
    })
    .catch(err => {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        return res.status(400).json({ email: 'Email already in use' });
      }
      return res
        .status(500)
        .json({ general: 'Something went wrong, please try again' });
    });
};

//Route for Login
exports.login = (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password
  };
  let refreshToken;

  const { valid, errors } = validateLoginData(user);
  if (!valid) return res.status(400).json(errors);

  return firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then(data => {
      refreshToken = data.user.refreshToken;
      return data.user.getIdToken();
    })
    .then(token => {
      return res.json({ token, refreshToken });
    })
    .catch(err => {
      console.error(err);
      return res
        .status(403)
        .json({ general: 'Wrong credentials, please try again' });
    });
};

//Get user details
exports.getUserDetails = (req, res) => {
  let resData = {};
  console.log(req.user.usernm);
  db.doc(`/users/${req.user.username}`)
    .get()
    .then(doc => {
      if (doc.exists) {
        resData.credentials = doc.data();
        return db
          .collection('forms')
          .where('userId', '==', req.user.id)
          .get();
      }
      return res.status(500).json({ error: 'User does not exist' });
    })
    .then(data => {
      resData.forms = [];
      data.forEach(doc => {
        resData.forms.push({
          formId: doc.id,
          inputs: doc.data().inputs,
          created: doc.data().created,
          title: doc.data().title,
          description: doc.data().description
        });
      });
      return res.json(resData);
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};
