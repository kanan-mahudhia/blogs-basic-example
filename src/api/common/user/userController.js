const express = require('express');
const router = express.Router();
const { body, validationResult, param } = require('express-validator');

const DecodeService = require('../decodeService/decodeService');
const decodeService = new DecodeService();

const UserService = require('./userService');
const userService = new UserService();

const cipherHelper = require('../auth/cipherHelper');

router.get('/current', (req, res) => {
  userService
    .findById(req.user.id)
    .then(user => res.send(
      {
        status: 200,
        data: user
      }
    ))
    .catch(err => res.status(400).send(
      {
        status: 400,
        err: err.message
      }
    ));
});

// get all users
router.get('/get_users', (req, res) => {
  userService
    .list()
    .then(users => res.status(200).send(
      {
        status: 200,
        data: users
      }
    ))
    .catch(err => res.status(400).send(
      {
        status: 400,
        err: err.message
      }
    ));
});

// change user password
router.post('/change_user_password', [
  body('password', 'Please enter valid password (min 6 characters)').isString().trim().isLength({ min: 6 }),
  body('confirmPassword', 'Please enter valid confirm password (min 6 characters)').isString().trim().isLength({ min: 6 })
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    var err_array = errors.array();
    res.status(422).send(
      {
        status: 422,
        err_msg: err_array[0].msg
      }
    );
  } else {
    const reset_password_token = cipherHelper.generateResetPasswordToken(req.user.id);
    // const { password, confirmPassword, reset_password_token: resetPasswordToken } = req.body;
    userService
      .changeUserPassword(req.body.password, req.body.confirmPassword, reset_password_token)
      .then(() => res.send(
        {
          status: 200,
          data: 'Password updated successfully!'
        }))
      .catch(err => res.status(400).send(
        {
          status: 400,
          err_msg: err.message
        }
        ));
  }
});

module.exports = router;
