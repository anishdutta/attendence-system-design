import 'dotenv/config';

const config = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  jwt: {
    secret: '83bd2bkd23i',
    accessExpirationMinutes: process.env.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: process.env.JWT_REFRESH_EXPIRATION_DAYS
  }
};

export default config;