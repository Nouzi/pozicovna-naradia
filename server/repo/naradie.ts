import type { Kategoria } from '../../src/shared/kategorie';
import type { NaradieSoStavom, NoveNaradie } from '../../src/shared/types';
import type { Databaza } from '../db/connection';

type RiadokNaradia = {
  id: number;
  nazov: string;
  kategoria: string;
  popis: string;
  vypozicka_id: number | null;
  meno_clena: string | null;
  vratit_do: string | null;
};

// Každé náradie spolu s nevrátenou výpožičkou, ak nejakú má.
const SELECT_NARADIE = `
  SELECT n.id, n.nazov, n.kategoria, n.popis,
         v.id AS vypozicka_id, c.meno AS meno_clena, v.vratit_do
  FROM naradie n
  LEFT JOIN vypozicky v ON v.naradie_id = n.id AND v.vratene IS NULL
  LEFT JOIN clenovia c ON c.id = v.clen_id`;

function naNaradie(r: RiadokNaradia): NaradieSoStavom {
  return {
    id: r.id,
    nazov: r.nazov,
    kategoria: r.kategoria as Kategoria,
    popis: r.popis,
    vypozicka:
      r.vypozicka_id === null
        ? null
        : { id: r.vypozicka_id, menoClena: r.meno_clena ?? '', vratitDo: r.vratit_do ?? '' }
  };
}

export function zoznamNaradia(db: Databaza): NaradieSoStavom[] {
  const riadky = db.prepare(`${SELECT_NARADIE} ORDER BY n.nazov`).all() as RiadokNaradia[];
  return riadky.map(naNaradie);
}

export function najdiNaradie(db: Databaza, id: number): NaradieSoStavom | null {
  const riadok = db.prepare(`${SELECT_NARADIE} WHERE n.id = ?`).get(id) as RiadokNaradia | undefined;
  return riadok ? naNaradie(riadok) : null;
}

export function pridajNaradie(db: Databaza, nove: NoveNaradie): NaradieSoStavom {
  const { lastInsertRowid } = db
    .prepare('INSERT INTO naradie (nazov, kategoria, popis) VALUES (?, ?, ?)')
    .run(nove.nazov, nove.kategoria, nove.popis);
  const naradie = najdiNaradie(db, Number(lastInsertRowid));
  if (!naradie) throw new Error('Pridané náradie sa nenašlo.');
  return naradie;
}
