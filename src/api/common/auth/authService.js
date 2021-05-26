const UserService = require('../user/userService');
const cipher = require('./cipherHelper');
const emailService = require('../../../utils/emailService');
const UserRepository = require('../user/userRepository');

class AuthService {
  constructor() {
    this.userService = new UserService();
    this.userRepository = new UserRepository();
  }

  //-----------------------------------------
  // User functions
  //-----------------------------------------

  // forgot user password
  requestUserPassword(email) {
    return this.userService
      .findByEmail(email)
      .then(user => {
        if (user) {
          var password = Math.random().toString(36).substring(7);
          const { salt, passwordHash } = cipher.saltHashPassword(password);
          return this.userRepository.changePassword(user._id, salt, passwordHash)
          .then(() => {
            return emailService.sendResetUserPasswordEmail(user, password);
          });

          // old
          // const token = cipher.generateResetPasswordToken(user._id);
          // return emailService.sendResetUserPasswordEmail(user, token);
        }
        throw new Error('There is no defined email in the system.');
      });
  }

}

module.exports = AuthService;
