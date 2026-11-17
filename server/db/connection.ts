import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { DatabaseSync } from 'node:sqlite';

export type Databaza = DatabaseSync;

/** Otvorí databázu SQLite. Cesta ':memory:' vytvorí dočasnú databázu v pamäti, ktorú používajú testy. */
export function otvorDatabazu(cesta: string): Databaza {
  if (cesta !== ':memory:') mkdirSync(dirname(cesta), { recursive: true });
  const db = new DatabaseSync(cesta);
  db.exec('PRAGMA foreign_keys = ON');
  return db;
}

/** Spustí funkciu v transakcii. Keď funkcia vyhodí chybu, všetky jej zmeny sa vrátia. */
export function transakcia<T>(db: Databaza, funkcia: () => T): T {
  db.exec('BEGIN');
  try {
    const vysledok = funkcia();
    db.exec('COMMIT');
    return vysledok;
  } catch (chyba) {
    db.exec('ROLLBACK');
    throw chyba;
  }
}
