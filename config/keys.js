const { PORT, DB_URL, ATLAS_DB_URL } = process.env;

module.exports = {
  port: PORT,
  dbUrl: DB_URL,
  atlasDbUrl: ATLAS_DB_URL,
};
