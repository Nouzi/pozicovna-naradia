import { pridajDni } from '../../src/shared/datum';
import type { Kategoria } from '../../src/shared/kategorie';
import { DLZKA_VYPOZICKY_DNI } from '../../src/shared/vypozicky';
import { transakcia, type Databaza } from './connection';

const NARADIE: { nazov: string; kategoria: Kategoria; popis: string }[] = [
  { nazov: 'Aku vŕtačka 18 V', kategoria: 'elektricke', popis: 'Dve batérie a nabíjačka v kufri.' },
  { nazov: 'Príklepová vŕtačka', kategoria: 'elektricke', popis: 'Na betón a tehlu. Vrtáky nie sú súčasťou.' },
  { nazov: 'Uhlová brúska', kategoria: 'elektricke', popis: 'Kotúč 125 mm. Používajte ochranné okuliare.' },
  { nazov: 'Priamočiara píla', kategoria: 'elektricke', popis: '' },
  { nazov: 'Kotúčová píla', kategoria: 'elektricke', popis: 'Iba po zaškolení v dielni.' },
  { nazov: 'Elektrický hoblík', kategoria: 'elektricke', popis: '' },
  { nazov: 'Sada skrutkovačov', kategoria: 'rucne', popis: '12 kusov, ploché aj krížové.' },
  { nazov: 'Ručná píla na drevo', kategoria: 'rucne', popis: '' },
  { nazov: 'Gumená palica', kategoria: 'rucne', popis: '' },
  { nazov: 'Sada imbusových kľúčov', kategoria: 'rucne', popis: '' },
  { nazov: 'Stolárske svorky', kategoria: 'rucne', popis: 'Štyri kusy, rozpätie do 300 mm.' },
  { nazov: 'Kosačka na trávu', kategoria: 'zahrada', popis: 'Benzínová. Palivo si doneste.' },
  { nazov: 'Záhradné nožnice', kategoria: 'zahrada', popis: '' },
  { nazov: 'Rýľ', kategoria: 'zahrada', popis: '' },
  { nazov: 'Fúrik', kategoria: 'zahrada', popis: '' },
  { nazov: 'Laserový merač vzdialenosti', kategoria: 'meranie', popis: 'Dosah 40 m.' },
  { nazov: 'Vodováha 120 cm', kategoria: 'meranie', popis: '' },
  { nazov: 'Krížový laser', kategoria: 'meranie', popis: 'Statív je v rovnakom kufri.' }
];

const CLENOVIA = [
  { meno: 'Jana Kováčová', email: 'jana.kovacova@example.com' },
  { meno: 'Peter Horváth', email: 'peter.horvath@example.com' },
  { meno: 'Lucia Nagyová', email: 'lucia.nagyova@example.com' },
  { meno: 'Martin Varga', email: 'martin.varga@example.com' },
  { meno: 'Zuzana Tóthová', email: 'zuzana.tothova@example.com' }
];

// Výpožičky sú relatívne k dnešku, aby boli v dátach vždy aktuálne aj oneskorené výpožičky.
// pred = pred koľkými dňami si člen náradie požičal, vratenePred = pred koľkými dňami ho vrátil.
const VYPOZICKY: { naradie: string; clen: string; pred: number; vratenePred?: number }[] = [
  { naradie: 'Aku vŕtačka 18 V', clen: 'Peter Horváth', pred: 3 },
  { naradie: 'Krížový laser', clen: 'Lucia Nagyová', pred: 1 },
  { naradie: 'Kosačka na trávu', clen: 'Jana Kováčová', pred: 10 },
  { naradie: 'Stolárske svorky', clen: 'Martin Varga', pred: 9 },
  { naradie: 'Uhlová brúska', clen: 'Zuzana Tóthová', pred: 20, vratenePred: 14 },
  { naradie: 'Rýľ', clen: 'Peter Horváth', pred: 30, vratenePred: 21 }
];

/** Naplní prázdnu databázu testovacími dátami. Dátumy výpožičiek počíta od zadaného dňa. */
export function naplnTestovacimiDatami(db: Databaza, dnes: string): void {
  transakcia(db, () => {
    const vlozNaradie = db.prepare('INSERT INTO naradie (nazov, kategoria, popis) VALUES (?, ?, ?)');
    const idNaradia = new Map<string, number>();
    for (const n of NARADIE) {
      idNaradia.set(n.nazov, Number(vlozNaradie.run(n.nazov, n.kategoria, n.popis).lastInsertRowid));
    }

    const vlozClena = db.prepare('INSERT INTO clenovia (meno, email) VALUES (?, ?)');
    const idClena = new Map<string, number>();
    for (const c of CLENOVIA) {
      idClena.set(c.meno, Number(vlozClena.run(c.meno, c.email).lastInsertRowid));
    }

    const vlozVypozicku = db.prepare(
      'INSERT INTO vypozicky (naradie_id, clen_id, pozicane, vratit_do, vratene) VALUES (?, ?, ?, ?, ?)'
    );
    for (const v of VYPOZICKY) {
      const pozicane = pridajDni(dnes, -v.pred);
      const vratene = v.vratenePred === undefined ? null : pridajDni(dnes, -v.vratenePred);
      vlozVypozicku.run(
        idNaradia.get(v.naradie)!,
        idClena.get(v.clen)!,
        pozicane,
        pridajDni(pozicane, DLZKA_VYPOZICKY_DNI),
        vratene
      );
    }
  });
}

/** Zistí, či je databáza bez náradia, napríklad hneď po prvých migráciách. */
export function jePrazdna(db: Databaza): boolean {
  const { pocet } = db.prepare('SELECT COUNT(*) AS pocet FROM naradie').get() as { pocet: number };
  return pocet === 0;
}
