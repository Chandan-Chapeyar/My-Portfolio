# My Portfolio

Personal portfolio website showcasing my skills, education, certificates, projects, and contact form.

## Project layout

```text
index.html          Page content and section structure
css/style.css       Themes, components, and responsive layout
js/                 Navigation, contact form, projects, and 3D background behavior
api/index.js        Vercel API entry point
lib/app.js          Shared Express API routes
db/                 PostgreSQL connection, schema, and project seed data
assets/certificates/ Certificate previews and original PDF files
dev-server.js       Local web server for the page and API
```

## Run locally

```text
npm install
npm run dev
```

Open `http://localhost:3000`. The portfolio page can load without a database; project and contact API features need a PostgreSQL connection.

To initialize the database, copy `.env.example` to `.env`, set `DATABASE_URL`, then run `npm run db:setup`.
