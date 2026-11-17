import { serve } from '@hono/node-server';
import { dnes } from '../src/shared/datum';
import { vytvorAplikaciu } from './app';
import { DB_PATH, PORT } from './config';
import { otvorDatabazu } from './db/connection';
import { spustiMigracie } from './db/migrate';
import { jePrazdna, naplnTestovacimiDatami } from './db/seed';

const db = otvorDatabazu(DB_PATH);

const nove = spustiMigracie(db);
if (nove.length > 0) console.log(`Spustené migrácie: ${nove.join(', ')}`);

if (jePrazdna(db)) {
  naplnTestovacimiDatami(db, dnes());
  console.log('Databáza bola prázdna, naplnil som ju testovacími dátami.');
}

const app = vytvorAplikaciu({ db, dnes: () => dnes() });

serve({ fetch: app.fetch, port: PORT }, (info) => {
  console.log(`API beží na http://localhost:${info.port}/api`);
});
