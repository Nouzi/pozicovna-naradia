-- Členovia dielne. Náradie si môžu požičať iba členovia.
CREATE TABLE clenovia (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  meno TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  vytvorene TEXT NOT NULL DEFAULT (datetime('now'))
);
