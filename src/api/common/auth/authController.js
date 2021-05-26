const express = require('express');
const { body, validationResult } = require('express-validator');

const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const config = require('config');

const AuthService = require('./authService');
const authService = new AuthService();

const UserService = require('../user/userService');
const userService = new UserService();


//-----------------------------------------
// User APIs
//-----------------------------------------
// save user
router.post('/save_user', [
  body('first_name', 'Please enter valid first name').isString().trim().isLength({ min: 2 }),
  body('last_name', 'Please enter valid last name').isString().trim().isLength({ min: 2 }),
  body('email', 'Please enter valid email').trim().isEmail()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    var err_array = errors.array();
    res.status(422).send(
      {
        status: 422,
        err_msg: err_array[0].msg
      });
  } else {
      userService
        .register_user(req.body)
        .then(() => res.status(200).send(
          {
            status: 200,
            data: "You have been registered successfully! Please check your email for the login credentials."
          }
          ))
        .catch(err => res.status(400).send(
          {
            status: 400,
            err_msg: err.message
          }
          ));
                
        
  }
});

// register
router.post('/register', [
  body('first_name', 'Please enter valid first name').isString().trim().isLength({ min: 2 }),
  body('last_name', 'Please enter valid last name').isString().trim().isLength({ min: 2 }),
  body('email', 'Please enter valid email').trim().isEmail()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    var err_array = errors.array();
    res.status(422).send(
      {
        status: 422,
        err_msg: err_array[0].msg
      });
  } else {
      userService
        .register_u(req.body)
        .then(() => res.status(200).send(
          {
            status: 200,
            data: "You have been registered successfully! Please check your email for the login credentials."
          }
          ))
        .catch(err => res.status(400).send(
          {
            status: 400,
            err_msg: err.message
          }
          ));
                
        
  }
});

// register
router.get('/confirmation/:email/:token', (req, res) => {
  userService
    .confirm_user(req.params.email, req.params.token)
    .then((data) => res.status(200).send(
      {
        status: 200,
        data: data
      }
    ))
    .catch(err => res.status(400).send(
      {
        status: 400,
        err_msg: err.message
      }
    ));
});

// user login
router.post('/user_login', (req, res) => {
  passport.authenticate('user-local', { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(401).send(
        err ? err.message : 
        {
          status: 401,
          err_msg: 'email or password is incorrect'
        },
      );
    }
    req.login(user, { session: false }, (error) => {
      if (error) {
        res.send(error);
      }
      const token = jwt.sign(user, config.get('auth.jwt.secret'), { expiresIn: config.get('auth.jwt.expiresIn') });
      userService.findById(user.id)
      .then(user_data => {
        if(user_data) {
          return res.send({ 
              status: 200,
              data: {
                token, user: user_data
              }
             });
        }
        else {
          return res.send(
            {
              status: 404,
              err_msg: 'User does not exists'
            }
          )
        }
      });
    });
  })(req, res);
});

// forgot user password
router.post('/forgot_user_password', body('email', 'Please select valid email').trim().isEmail(), (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    var err_array = errors.array();
    res.status(422).send({
      status: 422,
      err_msg: err_array[0].msg
    });
  } else {
    const { email } = req.body;
    authService
      .requestUserPassword(email)
      .then(() => res.send({ message: `Email with reset password instructions has been sent to email ${email}.` }))
      .catch(err => res.status(404).send(
        {
          status: 404,
          err_msg: err.message
        }));
  }
});

// Signout
router.post('/sign-out', (req, res) => {
  res.send({
    status: 200,
    data: "You have uccessfully signed out!"
  });
});


module.exports = router;
