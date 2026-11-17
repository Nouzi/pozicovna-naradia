import { Hono } from 'hono';
import { overNoveNaradie } from '../../src/shared/naradie';
import type { Kontext } from '../kontext';
import { najdiNaradie, pridajNaradie, zoznamNaradia } from '../repo/naradie';
import { nacitajTelo, parsujId } from './pomocne';

// /api/naradie
export function naradieRoutes({ db }: Kontext) {
  return new Hono()
    .get('/', (c) => c.json(zoznamNaradia(db)))

    .get('/:id', (c) => {
      const id = parsujId(c.req.param('id'));
      const naradie = id === null ? null : najdiNaradie(db, id);
      if (!naradie) return c.json({ chyba: 'Náradie sa nenašlo.' }, 404);
      return c.json(naradie);
    })

    .post('/', async (c) => {
      const overenie = overNoveNaradie(await nacitajTelo(c));
      if (!overenie.ok) return c.json({ chyba: overenie.chyby.join(' ') }, 400);
      return c.json(pridajNaradie(db, overenie.hodnota), 201);
    });
}
