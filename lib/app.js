const express = require("express");
const pool = require("../db/pool");

const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: "20kb" }));

// Return the saved project list for the portfolio cards.
app.get("/api/projects", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, title, description, tags, link_url FROM projects ORDER BY sort_order, id"
    );
    res.set("Cache-Control", "public, max-age=60");
    res.json(rows);
  } catch (err) {
    console.error("GET /api/projects", err.message);
    res.status(500).json({ error: "Could not load projects." });
  }
});

// Validate and save messages sent through the contact form.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Allow five contact attempts per IP every ten minutes on this server instance.
const hits = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 10 * 60 * 1000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

app.post("/api/contact", async (req, res) => {
  const ip = req.headers["x-forwarded-for"]?.split(",")[0].trim() || req.ip;
  if (rateLimited(ip)) {
    return res.status(429).json({ error: "Too many messages. Please try again later." });
  }

  const name = String(req.body?.name ?? "").trim();
  const email = String(req.body?.email ?? "").trim();
  const message = String(req.body?.message ?? "").trim();

  const errors = {};
  if (name.length < 2 || name.length > 100) errors.name = "Name must be 2-100 characters.";
  if (!EMAIL_RE.test(email) || email.length > 254) errors.email = "Enter a valid email address.";
  if (message.length < 10 || message.length > 2000) errors.message = "Message must be 10-2000 characters.";
  if (Object.keys(errors).length) return res.status(400).json({ error: "Validation failed.", errors });

  try {
    await pool.query("INSERT INTO messages (name, email, message) VALUES ($1,$2,$3)", [
      name,
      email,
      message,
    ]);
    res.status(201).json({ ok: true });
  } catch (err) {
    console.error("POST /api/contact", err.message);
    res.status(500).json({ error: "Could not save your message." });
  }
});

app.use("/api", (req, res) => res.status(404).json({ error: "Not found." }));

module.exports = app;
