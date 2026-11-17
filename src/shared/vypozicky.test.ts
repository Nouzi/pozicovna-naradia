import { describe, expect, it } from 'vitest';
import { DLZKA_VYPOZICKY_DNI, jeDostupne, vratitDo } from './vypozicky';

describe('vratitDo', () => {
  it(`náradie sa vracia o ${DLZKA_VYPOZICKY_DNI} dní`, () => {
    expect(vratitDo('2026-03-10')).toBe('2026-03-17');
  });
});

describe('jeDostupne', () => {
  const naradie = { id: 1, nazov: 'Rýľ', kategoria: 'zahrada' as const, popis: '' };

  it('náradie v dielni je dostupné', () => {
    expect(jeDostupne({ ...naradie, vypozicka: null })).toBe(true);
  });

  it('požičané náradie nie je dostupné', () => {
    expect(jeDostupne({ ...naradie, vypozicka: { id: 3, menoClena: 'Jana', vratitDo: '2026-03-17' } })).toBe(false);
  });
});
