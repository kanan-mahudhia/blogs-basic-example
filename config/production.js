module.exports = {

  api: {
    port: 3002,
    root: '/api',
  },

  auth: {
    jwt: {
      secret: 'jwt-secret',
      expiresIn:  '24h'
    },
    resetPassword: {
      secret: 'resetpasswordSecret',
    },
  },

  db: {
    url: 'mongodb://localhost:27017/db_blog',
    name: 'db_blog',
  },
};
