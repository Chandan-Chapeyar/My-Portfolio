const fs = require("fs");
const path = require("path");
const pool = require("./pool");
const projects = require("./seed-data");

// Create the tables and load the project's current cards from seed-data.js.
(async () => {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set. Copy .env.example to .env and fill it in.");
    process.exit(1);
  }
  const client = await pool.connect();
  try {
    await client.query(fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8"));
    // Replace the project list in one transaction so a failed insert can be rolled back.
    await client.query("BEGIN");
    await client.query("DELETE FROM projects");
    for (const [i, p] of projects.entries()) {
      await client.query(
        "INSERT INTO projects (title, description, tags, link_url, sort_order) VALUES ($1,$2,$3,$4,$5)",
        [p.title, p.description, p.tags, p.link_url, i]
      );
    }
    await client.query("COMMIT");
    console.log(`Database ready. ${projects.length} project(s) loaded.`);
  } catch (err) {
    await client.query("ROLLBACK").catch(() => {});
    console.error("Setup failed:", err.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
})();
