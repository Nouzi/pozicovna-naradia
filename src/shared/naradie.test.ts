import { describe, expect, it } from 'vitest';
import { MAX_DLZKA_NAZVU, overNoveNaradie } from './naradie';

describe('overNoveNaradie', () => {
  it('prijme platné údaje a oreže medzery', () => {
    expect(overNoveNaradie({ nazov: '  Fúrik ', kategoria: 'zahrada', popis: ' Nové koleso. ' })).toEqual({
      ok: true,
      hodnota: { nazov: 'Fúrik', kategoria: 'zahrada', popis: 'Nové koleso.' }
    });
  });

  it('popis je nepovinný', () => {
    expect(overNoveNaradie({ nazov: 'Rýľ', kategoria: 'zahrada' })).toMatchObject({ ok: true, hodnota: { popis: '' } });
  });

  it('vyžaduje názov a kategóriu', () => {
    expect(overNoveNaradie({ nazov: '   ', kategoria: 'neexistuje' })).toEqual({
      ok: false,
      chyby: ['Zadajte názov náradia.', 'Vyberte kategóriu.']
    });
  });

  it('odmietne príliš dlhý názov', () => {
    const vysledok = overNoveNaradie({ nazov: 'x'.repeat(MAX_DLZKA_NAZVU + 1), kategoria: 'rucne' });
    expect(vysledok.ok).toBe(false);
  });

  it('zvládne aj vstup, ktorý nie je objekt', () => {
    expect(overNoveNaradie(null).ok).toBe(false);
  });
});
