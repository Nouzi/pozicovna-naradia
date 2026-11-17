import type { Clen } from '../../src/shared/types';
import type { Databaza } from '../db/connection';

export function zoznamClenov(db: Databaza): Clen[] {
  return db.prepare('SELECT id, meno, email FROM clenovia ORDER BY meno').all() as Clen[];
}

export function najdiClena(db: Databaza, id: number): Clen | null {
  const clen = db.prepare('SELECT id, meno, email FROM clenovia WHERE id = ?').get(id) as Clen | undefined;
  return clen ?? null;
}
