import type { Kategoria } from './kategorie';
import type { NaradieSoStavom } from './types';

export type Filter = {
  text: string;
  kategoria: Kategoria | 'vsetky';
  ibaDostupne: boolean;
};

export const PRAZDNY_FILTER: Filter = { text: '', kategoria: 'vsetky', ibaDostupne: false };

/** Vyberie náradie podľa textu v názve alebo popise, kategórie a dostupnosti. Výsledok zoradí podľa abecedy. */
export function filtrujNaradie(zoznam: NaradieSoStavom[], filter: Filter): NaradieSoStavom[] {
  const hladane = filter.text.trim().toLowerCase();

  return zoznam
    .filter((naradie) => {
      if (filter.kategoria !== 'vsetky' && naradie.kategoria !== filter.kategoria) return false;
      if (filter.ibaDostupne && naradie.vypozicka !== null) return false;
      if (!hladane) return true;
      return naradie.nazov.toLowerCase().includes(hladane) || naradie.popis.toLowerCase().includes(hladane);
    })
    .sort((a, b) => a.nazov.localeCompare(b.nazov, 'sk'));
}
