-- Výpožičky náradia. Dátumy sú text RRRR-MM-DD.
-- Kým náradie nie je vrátené, stĺpec vratene je NULL.
CREATE TABLE vypozicky (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  naradie_id INTEGER NOT NULL REFERENCES naradie (id),
  clen_id INTEGER NOT NULL REFERENCES clenovia (id),
  pozicane TEXT NOT NULL,
  vratit_do TEXT NOT NULL,
  vratene TEXT
);

CREATE INDEX vypozicky_clen ON vypozicky (clen_id);

-- Jedno náradie môže mať naraz najviac jednu nevrátenú výpožičku.
CREATE UNIQUE INDEX vypozicky_jedna_aktivna ON vypozicky (naradie_id) WHERE vratene IS NULL;
