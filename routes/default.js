const express = require('express');
const router = express.Router();

const {
  generateHashedPassword,
  usernameExists,
  emailExists,
  validatePassword,
  generateCookie,
  addUser
} = require('../bin/helpers/functionHelpers.js');

router.get('/', (req, res) => {
  res.render('index');
});

router.post('/login', (req, res) => {
  const {email, password} = req.body;
  validatePassword(email, password)
    .then((result) => {
      if (result) {
        req.session.user = email;
        req.flash('success', 'Welcome back');
        return res.redirect('/');
      }
      req.flash('error', 'Login error');
      return res.redirect('/');
    })
    .catch((err) => {
      console.log('error route section');
      req.flash('error', 'Login error');
      return res.redirect('/');
    });
});

router.post('/logout', (req, res) => {
  req.session = null;
  return res.redirect('/');
});

router.post('/register', (req, res) => {
  const {username, email, password, confirmPassword} = req.body;

  if (username === '' || email === '' || password === '' || confirmPassword === '') {
    req.flash('error', 'Enter information in all fields.');
    return res.redirect('/');
  }

  if (password !== confirmPassword) {
    req.flash('error', 'Passwords must match.');
    return res.redirect('/');
  }

  emailExists(email)
    .then((foundEmail) => {
      if (foundEmail) throw new Error();
    })
    .then(() => usernameExists(username))
    .then((foundUsername) => {
      if (foundUsername) throw new Error();
    })
    .then(() => addUser(username, email, password))
    .then(() => {
      req.flash('success', 'new user added');
      return res.redirect('/');
    })
    .catch(() => {
      req.flash('error', 'username/email already exists in database');
      return res.redirect('/');
    });
});

module.exports = router;
