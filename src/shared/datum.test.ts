import { describe, expect, it } from 'vitest';
import { dnes, formatujDatum, jeDatum, pridajDni } from './datum';

describe('jeDatum', () => {
  it('prijme platný dátum', () => {
    expect(jeDatum('2026-03-07')).toBe(true);
    expect(jeDatum('2024-02-29')).toBe(true);
  });

  it('odmietne neexistujúci dátum alebo iný tvar', () => {
    expect(jeDatum('2026-02-30')).toBe(false);
    expect(jeDatum('2025-02-29')).toBe(false);
    expect(jeDatum('7. 3. 2026')).toBe(false);
    expect(jeDatum('')).toBe(false);
  });
});

describe('dnes', () => {
  it('vráti dátum v tvare RRRR-MM-DD', () => {
    expect(dnes(new Date(2026, 2, 7, 23, 30))).toBe('2026-03-07');
  });
});

describe('pridajDni', () => {
  it('prejde cez koniec mesiaca aj roka', () => {
    expect(pridajDni('2026-01-28', 7)).toBe('2026-02-04');
    expect(pridajDni('2026-12-29', 7)).toBe('2027-01-05');
  });

  it('počíta s priestupným rokom', () => {
    expect(pridajDni('2028-02-27', 2)).toBe('2028-02-29');
  });

  it('so záporným počtom dni odpočíta', () => {
    expect(pridajDni('2026-03-01', -1)).toBe('2026-02-28');
  });
});

describe('formatujDatum', () => {
  it('zobrazí dátum po slovensky bez úvodných núl', () => {
    expect(formatujDatum('2026-03-07')).toBe('7. 3. 2026');
    expect(formatujDatum('2026-11-17')).toBe('17. 11. 2026');
  });
});
