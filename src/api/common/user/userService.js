const crypto = require('crypto');
const cipher = require('../auth/cipherHelper');
const config = require('config');
const jwt = require('jsonwebtoken');
const UserRepository = require('./userRepository');
const emailService = require('../../../utils/emailService');

class UserService {
  constructor() {
    this.repository = new UserRepository();
  }

  // change password
  changeUserPassword(password, confirmPassword, resetPasswordToken) {
    if (password.length < 6) {
      throw new Error('Password should be longer than 6 characters');
    }

    if (password !== confirmPassword) {
      throw new Error('Password and its confirmation do not match.');
    }

    const tokenContent = cipher.decipherResetPasswordToken(resetPasswordToken);
    if (new Date().getTime() > tokenContent.valid) {
      throw new Error('Reset password token has expired.');
    }

    const { salt, passwordHash } = cipher.saltHashPassword(password);
    return this.changePassword(tokenContent.userId, salt, passwordHash);
  }

  // get all users
  list() {
    return this.repository.getAllUsers();
  }

  //get count
  getCount() {
    return this.repository.getCount();
  }

  // get user by email
  findByEmail(email) {
    return this.repository.findByEmail(email);
  }

  // get user by id
  findById(id) {
    return this.repository.findById(id)
      .then(user => user);
  }

  // register user
  register_user(user) {
    var password = Math.random().toString(36).substring(7);
    return this.repository.findByEmail(user.email)
      .then(u => {
        if (u) {
          throw new Error('User already exists');
        }
        const { salt, passwordHash } = cipher.saltHashPassword(password);
        const newUser = {
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          created_timestamp: new Date(),
          updated_timestamp: "",
          salt,
          passwordHash
        };
        return this.repository.add(newUser);
      })
      .then(() => {
        return emailService.sendNewUserEmail(user.first_name + " " + user.last_name, user.email, password);
      });
  }

   // register user
   register_u(user) {
    var password = Math.random().toString(36).substring(7);
    var user_token = jwt.sign({ email: user.email, token: crypto.randomBytes(16).toString('hex') }, config.get('auth.jwt.secret'));
    return this.repository.findByEmail(user.email)
      .then(u => {
        if (u) {
          throw new Error('User already exists');
        }
        const { salt, passwordHash } = cipher.saltHashPassword(password);
        const newUser = {
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          created_timestamp: new Date(),
          updated_timestamp: "",
          is_verified: false,
          salt,
          passwordHash,
          verification_token: user_token
        };

        // return newUser;
        return this.repository.add(newUser);
      })
      .then(() => {
        // return emailService.sendNewUserEmail(user.first_name + " " + user.last_name, user.email, password);
        return emailService.sendVerifyUserEmail(user.first_name + " " + user.last_name, user.email, user_token);
        
      });
  }

  confirm_user(email, token) {
    return this.repository.confirm_user(email, token)
      .then(result => result);
  }

  // change user password
  changePassword(user_id, salt, passwordHash) {
    return this.repository.findById(user_id)
      .then(user_data => {
        if (user_data.length > 0) {
          return this.repository.changePassword(user_id, salt, passwordHash)
            .then((data) => {
              return emailService.sendChangeUserPasswordEmail(user_data)
                .then(() => { return data });
            })
        } else { throw new Error("No user found") }
      });
  }

  addMany(users) {
    return this.repository.addMany(users);
  }

  mapUserToDto(user) {
    return user ? {
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      created_timestamp: user.created_timestamp,
      updated_timestamp: user.updated_timestamp,
      salt: user.salt,
      passwordHash: user.passwordHash
    } : {};
  }
}

module.exports = UserService;
