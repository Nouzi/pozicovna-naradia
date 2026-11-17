// Dátumy ukladáme ako text RRRR-MM-DD, bez času a časovej zóny.

const TVAR_DATUMU = /^\d{4}-\d{2}-\d{2}$/;

/** Overí, že text je platný dátum v tvare RRRR-MM-DD (napríklad 2026-02-30 neplatí). */
export function jeDatum(hodnota: string): boolean {
  if (!TVAR_DATUMU.test(hodnota)) return false;
  const datum = new Date(`${hodnota}T00:00:00Z`);
  return !Number.isNaN(datum.getTime()) && datum.toISOString().slice(0, 10) === hodnota;
}

/** Dnešný dátum v miestnom čase. */
export function dnes(teraz: Date = new Date()): string {
  const rok = teraz.getFullYear();
  const mesiac = String(teraz.getMonth() + 1).padStart(2, '0');
  const den = String(teraz.getDate()).padStart(2, '0');
  return `${rok}-${mesiac}-${den}`;
}

/** Pripočíta k dátumu počet dní. Záporný počet dni odpočíta. Počíta v UTC, aby nevadil letný čas. */
export function pridajDni(datum: string, dni: number): string {
  const vysledok = new Date(`${datum}T00:00:00Z`);
  vysledok.setUTCDate(vysledok.getUTCDate() + dni);
  return vysledok.toISOString().slice(0, 10);
}

/** Dátum na zobrazenie v rozhraní, napríklad 7. 3. 2026. */
export function formatujDatum(datum: string): string {
  const [rok, mesiac, den] = datum.split('-').map(Number);
  return `${den}. ${mesiac}. ${rok}`;
}
