/** Kategórie náradia. Kľúč sa ukladá do databázy, hodnota sa zobrazuje v rozhraní. */
export const KATEGORIE = {
  elektricke: 'Elektrické náradie',
  rucne: 'Ručné náradie',
  zahrada: 'Záhrada',
  meranie: 'Meranie'
} as const;

export type Kategoria = keyof typeof KATEGORIE;

export function jeKategoria(hodnota: unknown): hodnota is Kategoria {
  return typeof hodnota === 'string' && Object.hasOwn(KATEGORIE, hodnota);
}
