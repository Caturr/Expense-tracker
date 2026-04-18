export default () => ({
  app: {
    port: Number(process.env.PORT ?? 3000),
  },
  database: {
    url: process.env.DATABASE_URL,
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET ?? 'dev-only-change-me',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  },
});
