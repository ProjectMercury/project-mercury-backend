const { admin, db } = require('./admin');

module.exports = (req, res, next) => {
  let idToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    idToken = req.headers.authorization.split(' ')[1];
  } else {
    console.error('No token found');
    return res.status(403).json({ error: 'Not Authorized' });
  }

  return admin
    .auth()
    .verifyIdToken(idToken)
    .then(decodedToken => {
      req.user = decodedToken;
      return db
        .collection('users')
        .where('userId', '==', req.user.uid)
        .limit(1)
        .get();
    })
    .then(data => {
      req.user.username = data.docs[0].data().username;
      req.user.id = data.docs[0].data().userId;
      return next();
    })
    .catch(err => {
      console.error('Error while verifying', err);
      return res.status(403).json(err);
    });
};
