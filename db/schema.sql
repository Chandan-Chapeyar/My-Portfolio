-- Run automatically by `npm run db:setup` (safe to run more than once)

CREATE TABLE IF NOT EXISTS projects (
  id          SERIAL PRIMARY KEY,
  title       VARCHAR(120)  NOT NULL,
  description TEXT          NOT NULL,
  tags        TEXT[]        NOT NULL DEFAULT '{}',
  link_url    TEXT          NOT NULL DEFAULT '#',
  sort_order  INTEGER       NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS messages (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(254) NOT NULL,
  message    TEXT         NOT NULL,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT now()
);
