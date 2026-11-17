import { describe, expect, it } from 'vitest';
import { otvorDatabazu } from './connection';
import { spustiMigracie } from './migrate';

describe('spustiMigracie', () => {
  it('spustí všetky migrácie v poradí a pri druhom spustení už nič', () => {
    const db = otvorDatabazu(':memory:');

    expect(spustiMigracie(db)).toEqual([
      '001_naradie.sql',
      '002_clenovia.sql',
      '003_vypozicky.sql',
      '004_popis_naradia.sql'
    ]);
    expect(spustiMigracie(db)).toEqual([]);
  });

  it('po migráciách má náradie stĺpec popis', () => {
    const db = otvorDatabazu(':memory:');
    spustiMigracie(db);
    const stlpce = db.prepare('PRAGMA table_info(naradie)').all() as { name: string }[];

    expect(stlpce.map((s) => s.name)).toContain('popis');
  });
});
