import { Hono } from 'hono';
import { jeDostupne, vratitDo } from '../../src/shared/vypozicky';
import type { Kontext } from '../kontext';
import { najdiClena } from '../repo/clenovia';
import { najdiNaradie } from '../repo/naradie';
import { aktivneVypozicky, najdiVypozicku, oznacVratenie, vytvorVypozicku } from '../repo/vypozicky';
import { nacitajTelo, parsujId } from './pomocne';

// /api/vypozicky
export function vypozickyRoutes({ db, dnes }: Kontext) {
  return new Hono()
    .get('/', (c) => c.json(aktivneVypozicky(db)))

    // Požičanie náradia: { naradieId, clenId }
    .post('/', async (c) => {
      const telo = (await nacitajTelo(c)) as { naradieId?: unknown; clenId?: unknown } | null;
      const naradieId = parsujId(telo?.naradieId);
      const clenId = parsujId(telo?.clenId);
      if (naradieId === null || clenId === null) return c.json({ chyba: 'Vyberte náradie aj člena.' }, 400);

      const naradie = najdiNaradie(db, naradieId);
      if (!naradie) return c.json({ chyba: 'Náradie sa nenašlo.' }, 404);
      if (!najdiClena(db, clenId)) return c.json({ chyba: 'Člen sa nenašiel.' }, 404);
      if (!jeDostupne(naradie)) return c.json({ chyba: `Náradie ${naradie.nazov} je už požičané.` }, 409);

      const pozicane = dnes();
      const vypozicka = vytvorVypozicku(db, { naradieId, clenId, pozicane, vratitDo: vratitDo(pozicane) });
      return c.json(vypozicka, 201);
    })

    .post('/:id/vratenie', (c) => {
      const id = parsujId(c.req.param('id'));
      const vypozicka = id === null ? null : najdiVypozicku(db, id);
      if (!vypozicka) return c.json({ chyba: 'Výpožička sa nenašla.' }, 404);
      if (vypozicka.vratene) return c.json({ chyba: 'Náradie už bolo vrátené.' }, 409);
      return c.json(oznacVratenie(db, vypozicka.id, dnes()));
    });
}
