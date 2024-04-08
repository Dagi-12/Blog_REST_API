const { PORT, DB_URL, ATLAS_DB_URL, JWT_SECRET, EMAIL_PASSWORD, SENDER_EMAIL } =
  process.env;

module.exports = {
  port: PORT,
  dbUrl: DB_URL,
  atlasDbUrl: ATLAS_DB_URL,
  jwtSecret: JWT_SECRET,
  emailPassword: EMAIL_PASSWORD,
  senderEmail: SENDER_EMAIL,
};
