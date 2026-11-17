import { vytvorAplikaciu } from '../app';
import { otvorDatabazu } from '../db/connection';
import { spustiMigracie } from '../db/migrate';
import { naplnTestovacimiDatami } from '../db/seed';

/** Pevný „dnešok“ v testoch, aby výsledky nezáviseli od dátumu spustenia. */
export const TESTOVACI_DNES = '2026-03-10';

/** API nad čerstvou databázou v pamäti s testovacími dátami. Každý test dostane vlastnú. */
export function vytvorTestovaciuAplikaciu() {
  const db = otvorDatabazu(':memory:');
  spustiMigracie(db);
  naplnTestovacimiDatami(db, TESTOVACI_DNES);
  const app = vytvorAplikaciu({ db, dnes: () => TESTOVACI_DNES });
  return { app, db };
}

/** Pošle JSON na API a vráti stav odpovede spolu s telom. */
export async function posli(app: ReturnType<typeof vytvorAplikaciu>, cesta: string, metoda: string, telo?: unknown) {
  const odpoved = await app.request(cesta, {
    method: metoda,
    headers: { 'Content-Type': 'application/json' },
    body: telo === undefined ? undefined : JSON.stringify(telo)
  });
  return { status: odpoved.status, telo: await odpoved.json() };
}
