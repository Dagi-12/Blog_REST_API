const { PORT, DB_URL, ATLAS_DB_URL, JWT_SECRET } = process.env;

module.exports = {
  port: PORT,
  dbUrl: DB_URL,
  atlasDbUrl: ATLAS_DB_URL,
  jwtSecret: JWT_SECRET,
};
