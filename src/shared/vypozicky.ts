import { pridajDni } from './datum';
import type { NaradieSoStavom } from './types';

/** Na koľko dní si člen náradie požičiava. */
export const DLZKA_VYPOZICKY_DNI = 7;

/** Dátum, do ktorého treba vrátiť náradie požičané v daný deň. */
export function vratitDo(pozicane: string): string {
  return pridajDni(pozicane, DLZKA_VYPOZICKY_DNI);
}

/** Náradie sa dá požičať, iba keď je v dielni. */
export function jeDostupne(naradie: NaradieSoStavom): boolean {
  return naradie.vypozicka === null;
}
