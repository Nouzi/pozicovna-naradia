import { Hono } from 'hono';
import type { Kontext } from './kontext';
import { clenoviaRoutes } from './routes/clenovia';
import { naradieRoutes } from './routes/naradie';
import { vypozickyRoutes } from './routes/vypozicky';

/** Zostaví API. Server ho spúšťa v server/index.ts, testy ho volajú priamo cez app.request(). */
export function vytvorAplikaciu(kontext: Kontext) {
  const app = new Hono()
    .route('/api/naradie', naradieRoutes(kontext))
    .route('/api/clenovia', clenoviaRoutes(kontext))
    .route('/api/vypozicky', vypozickyRoutes(kontext));

  app.notFound((c) => c.json({ chyba: 'Takáto adresa v API neexistuje.' }, 404));
  app.onError((chyba, c) => {
    console.error(chyba);
    return c.json({ chyba: 'Na serveri nastala chyba.' }, 500);
  });

  return app;
}
