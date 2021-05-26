module.exports = {

  api: {
    port: 3001,
    root: '/api',
  },

  frontEnd: {
    domain: 'http://localhost:4200',
  },

  auth: {
    jwt: {
      secret: '0d7c5c5f-768c-4d98-8900-13aadaa21937',
      expiresIn: '24h',
    },
    resetPassword: {
      secret: '56gXxY{+D6/4m#kZ394j2=bT2eHqTAu>r8zAT>yEn:;TM#9*Vg',
      ttl: 86400 * 1000, // 1 day
      algorithm: 'aes256',
      inputEncoding: 'utf8',
      outputEncoding: 'hex',
    },
  },

  db: {
    url: 'mongodb://localhost:27017/db_blog',
    name: 'db_blog',
  },

  logger: {
    console: {
      level: 'debug',
    },
    file: {
      logDir: 'logs',
      logFile: 'bundle_node.log',
      level: 'debug',
      maxsize: 1024 * 1024 * 10, // 10MB
      maxFiles: 5,
    },
  },
};
