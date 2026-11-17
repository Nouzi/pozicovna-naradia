-- Náradie dostalo popis, napríklad príslušenstvo alebo upozornenie pre členov.
ALTER TABLE naradie ADD COLUMN popis TEXT NOT NULL DEFAULT '';
