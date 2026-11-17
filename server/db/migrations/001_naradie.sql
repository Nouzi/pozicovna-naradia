-- Náradie, ktoré dielňa požičiava. Kategória je kľúč z src/shared/kategorie.ts.
CREATE TABLE naradie (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nazov TEXT NOT NULL,
  kategoria TEXT NOT NULL,
  vytvorene TEXT NOT NULL DEFAULT (datetime('now'))
);
