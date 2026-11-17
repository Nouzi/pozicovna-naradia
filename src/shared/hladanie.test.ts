import { describe, expect, it } from 'vitest';
import { filtrujNaradie, PRAZDNY_FILTER } from './hladanie';
import type { NaradieSoStavom } from './types';

const zoznam: NaradieSoStavom[] = [
  { id: 1, nazov: 'Uhlová brúska', kategoria: 'elektricke', popis: 'Kotúč 125 mm.', vypozicka: null },
  {
    id: 2,
    nazov: 'Aku vŕtačka',
    kategoria: 'elektricke',
    popis: 'Dve batérie a nabíjačka.',
    vypozicka: { id: 7, menoClena: 'Peter Horváth', vratitDo: '2026-03-14' }
  },
  { id: 3, nazov: 'Rýľ', kategoria: 'zahrada', popis: '', vypozicka: null },
  { id: 4, nazov: 'Čerpadlo', kategoria: 'zahrada', popis: 'Na dažďovú vodu.', vypozicka: null }
];

const nazvy = (vysledok: NaradieSoStavom[]) => vysledok.map((n) => n.nazov);

describe('filtrujNaradie', () => {
  it('bez filtra vráti všetko zoradené podľa slovenskej abecedy', () => {
    expect(nazvy(filtrujNaradie(zoznam, PRAZDNY_FILTER))).toEqual(['Aku vŕtačka', 'Čerpadlo', 'Rýľ', 'Uhlová brúska']);
  });

  it('hľadá v názve bez ohľadu na veľké písmená', () => {
    expect(nazvy(filtrujNaradie(zoznam, { ...PRAZDNY_FILTER, text: 'VŔTAČKA' }))).toEqual(['Aku vŕtačka']);
  });

  it('hľadá aj v popise', () => {
    expect(nazvy(filtrujNaradie(zoznam, { ...PRAZDNY_FILTER, text: 'kotúč' }))).toEqual(['Uhlová brúska']);
  });

  it('vyberie iba zvolenú kategóriu', () => {
    expect(nazvy(filtrujNaradie(zoznam, { ...PRAZDNY_FILTER, kategoria: 'zahrada' }))).toEqual(['Čerpadlo', 'Rýľ']);
  });

  it('na požiadanie skryje požičané náradie', () => {
    expect(nazvy(filtrujNaradie(zoznam, { ...PRAZDNY_FILTER, ibaDostupne: true }))).not.toContain('Aku vŕtačka');
  });
});
