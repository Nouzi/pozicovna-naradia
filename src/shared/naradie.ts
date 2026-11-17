import { jeKategoria } from './kategorie';
import type { NoveNaradie } from './types';

export const MAX_DLZKA_NAZVU = 80;

export type VysledokOverenia =
  | { ok: true; hodnota: NoveNaradie }
  | { ok: false; chyby: string[] };

/** Overí údaje nového náradia. Používa ho formulár vo frontende aj API. */
export function overNoveNaradie(vstup: unknown): VysledokOverenia {
  const data = (typeof vstup === 'object' && vstup !== null ? vstup : {}) as Record<string, unknown>;
  const nazov = typeof data.nazov === 'string' ? data.nazov.trim() : '';
  const popis = typeof data.popis === 'string' ? data.popis.trim() : '';
  const kategoria = jeKategoria(data.kategoria) ? data.kategoria : null;
  const chyby: string[] = [];

  if (!nazov) {
    chyby.push('Zadajte názov náradia.');
  } else if (nazov.length > MAX_DLZKA_NAZVU) {
    chyby.push(`Názov môže mať najviac ${MAX_DLZKA_NAZVU} znakov.`);
  }
  if (!kategoria) {
    chyby.push('Vyberte kategóriu.');
  }

  if (chyby.length > 0 || !kategoria) return { ok: false, chyby };
  return { ok: true, hodnota: { nazov, kategoria, popis } };
}
