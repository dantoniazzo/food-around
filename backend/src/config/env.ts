export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  app: {
    port: process.env.PORT || '5000',
    routePrefix: process.env.APP_API_PREFIX || 'api',
    host: process.env.APP_HOST,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expire: process.env.JWT_EXPIRE,
    cookie_exp: process.env.JWT_COOKIE_EXPIRE,
  },
  db: {
    uri: process.env.MONGODB_URI,
  },
  frontend: {
    url: process.env.FRONTEND_URL,
  },
  email: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    secure: process.env.EMAIL_SECURE,
    sendgrid_api_key: process.env.SENDGRID_API_KEY,
    template_id: process.env.SENDGRID_TEMPLATE_ID,
  },
};
