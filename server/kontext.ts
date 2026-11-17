import type { Databaza } from './db/connection';

/**
 * Závislosti, ktoré dostanú všetky routy. Testy sem podstrčia databázu v pamäti
 * a pevný dátum, aby výsledky nezáviseli od toho, kedy sa spustia.
 */
export type Kontext = {
  db: Databaza;
  dnes: () => string;
};
