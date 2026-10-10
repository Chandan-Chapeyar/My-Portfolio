require("dotenv").config();
const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL;

// Neon / Render / Heroku need SSL; a local Postgres usually does not.
const isLocal = !connectionString || /localhost|127\.0\.0\.1/.test(connectionString);

// Reused between serverless invocations on Vercel.
const pool = new Pool({
  connectionString,
  ssl: isLocal ? false : { rejectUnauthorized: false },
  max: 5,
});

module.exports = pool;
