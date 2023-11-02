export default (): any => ({
  logDir: process.env.LOG_DIR,
  //to do : use database config from here
  database: {
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
  },
  jwt: {
    secretKey: process.env.JWT_APPLICATION_KEY,
    accessTokenExpiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
    refreshTokenExpiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
  },
});
