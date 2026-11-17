import type { Kategoria } from './kategorie';

// Typy, ktoré zdieľa server aj frontend. Dátumy sú text vo formáte RRRR-MM-DD.

/** Kus náradia, ktorý si členovia dielne môžu požičať. */
export type Naradie = {
  id: number;
  nazov: string;
  kategoria: Kategoria;
  popis: string;
};

/** Náradie spolu s nevrátenou výpožičkou. Keď je náradie v dielni, výpožička je null. */
export type NaradieSoStavom = Naradie & {
  vypozicka: AktualnaVypozicka | null;
};

export type AktualnaVypozicka = {
  id: number;
  menoClena: string;
  vratitDo: string;
};

/** Údaje na pridanie nového náradia. */
export type NoveNaradie = {
  nazov: string;
  kategoria: Kategoria;
  popis: string;
};

/** Člen dielne. Náradie si môžu požičať iba členovia. */
export type Clen = {
  id: number;
  meno: string;
  email: string;
};

/** Výpožička náradia. Kým náradie nie je vrátené, `vratene` je null. */
export type Vypozicka = {
  id: number;
  naradieId: number;
  clenId: number;
  pozicane: string;
  vratitDo: string;
  vratene: string | null;
};

/** Výpožička s názvom náradia a menom člena na zobrazenie v zozname. */
export type VypozickaDetail = Vypozicka & {
  nazovNaradia: string;
  menoClena: string;
};
