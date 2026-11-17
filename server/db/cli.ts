// Príkazy na prácu s lokálnou databázou: npm run db:migrate, db:seed a db:reset.
import { rmSync } from 'node:fs';
import { dnes } from '../../src/shared/datum';
import { DB_PATH } from '../config';
import { otvorDatabazu } from './connection';
import { spustiMigracie } from './migrate';
import { jePrazdna, naplnTestovacimiDatami } from './seed';

function migruj() {
  const db = otvorDatabazu(DB_PATH);
  const nove = spustiMigracie(db);
  console.log(nove.length ? `Spustené migrácie: ${nove.join(', ')}` : 'Databáza je aktuálna, žiadne nové migrácie.');
  return db;
}

function napln() {
  const db = migruj();
  if (!jePrazdna(db)) {
    console.error('Databáza už obsahuje dáta. Ak ju chcete začať odznova, spustite npm run db:reset.');
    process.exit(1);
  }
  naplnTestovacimiDatami(db, dnes());
  console.log('Databáza je naplnená testovacími dátami.');
}

const prikaz = process.argv[2];

switch (prikaz) {
  case 'migrate':
    migruj();
    break;
  case 'seed':
    napln();
    break;
  case 'reset':
    for (const pripona of ['', '-wal', '-shm']) rmSync(DB_PATH + pripona, { force: true });
    console.log(`Zmazaná databáza ${DB_PATH}.`);
    napln();
    break;
  default:
    console.error('Použitie: tsx server/db/cli.ts migrate | seed | reset');
    process.exit(1);
}
