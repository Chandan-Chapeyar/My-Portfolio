const path = require("path");
const express = require("express");
const app = require("./lib/app");

// Serve the site files alongside the API routes during local development.
const site = express.Router();
site.use("/css", express.static(path.join(__dirname, "css")));
site.use("/js", express.static(path.join(__dirname, "js")));
site.use("/assets", express.static(path.join(__dirname, "assets")));
site.get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")));
site.get("/index.html", (req, res) => res.sendFile(path.join(__dirname, "index.html")));
app.use(site);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Portfolio running at http://localhost:${port}`));
