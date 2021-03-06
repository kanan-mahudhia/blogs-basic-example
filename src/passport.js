const passport = require('passport');
// const refresh = require('passport-oauth2-refresh')
const LocalStrategy = require('passport-local').Strategy;
// const OAuth2Strategy = require('passport-oauth2');
// const OAuth2RefreshTokenStrategy = require('passport-oauth2-middleware').Strategy;
const passportJWT = require('passport-jwt');

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const jwt = require('jsonwebtoken');
const config = require('config');

const cipher = require('./api/common/auth/cipherHelper');
const UserService = require('./api/common/user/userService');
const userService = new UserService();

passport.use('user-local', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
},
  (email, password, cb) => {
    userService
      .findByEmail(email)
      .then(user => {
        const { passwordHash } = cipher.sha512(password, user.salt);

        if (!user || user.passwordHash !== passwordHash) {
          return cb(null, false, { message: 'Incorrect utils or password.' });
        }
        return cb(null, { id: user._id }, { message: 'Logged In Successfully' });
      })
      .catch(() => cb(null, false, { message: 'Incorrect utils or password.' }));
  }));

passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.get('auth.jwt.secret'),
},
  (jwtPayload, cb) => {
    return cb(null, jwtPayload);
  }));
