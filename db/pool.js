require("dotenv").config();
const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL;

const isLocal = !connectionString || /localhost|127\.0\.0\.1/.test(connectionString);

// Reuse this pool instead of opening a new database connection for each request.
const pool = new Pool({
  connectionString,
  // Local databases use plain connections; hosted ones use TLS without certificate checks.
  ssl: isLocal ? false : { rejectUnauthorized: false },
  // Keep the portfolio's database usage within a small connection limit.
  max: 5,
});

module.exports = pool;
