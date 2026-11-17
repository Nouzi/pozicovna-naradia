import type { VypozickaDetail } from '../../src/shared/types';
import type { Databaza } from '../db/connection';

type RiadokVypozicky = {
  id: number;
  naradie_id: number;
  clen_id: number;
  pozicane: string;
  vratit_do: string;
  vratene: string | null;
  nazov_naradia: string;
  meno_clena: string;
};

const SELECT_VYPOZICKY = `
  SELECT v.id, v.naradie_id, v.clen_id, v.pozicane, v.vratit_do, v.vratene,
         n.nazov AS nazov_naradia, c.meno AS meno_clena
  FROM vypozicky v
  JOIN naradie n ON n.id = v.naradie_id
  JOIN clenovia c ON c.id = v.clen_id`;

function naVypozicku(r: RiadokVypozicky): VypozickaDetail {
  return {
    id: r.id,
    naradieId: r.naradie_id,
    clenId: r.clen_id,
    pozicane: r.pozicane,
    vratitDo: r.vratit_do,
    vratene: r.vratene,
    nazovNaradia: r.nazov_naradia,
    menoClena: r.meno_clena
  };
}

/** Nevrátené výpožičky, najskôr tie, ktoré treba vrátiť najskôr. */
export function aktivneVypozicky(db: Databaza): VypozickaDetail[] {
  const riadky = db
    .prepare(`${SELECT_VYPOZICKY} WHERE v.vratene IS NULL ORDER BY v.vratit_do, v.id`)
    .all() as RiadokVypozicky[];
  return riadky.map(naVypozicku);
}

export function najdiVypozicku(db: Databaza, id: number): VypozickaDetail | null {
  const riadok = db.prepare(`${SELECT_VYPOZICKY} WHERE v.id = ?`).get(id) as RiadokVypozicky | undefined;
  return riadok ? naVypozicku(riadok) : null;
}

export function vytvorVypozicku(
  db: Databaza,
  udaje: { naradieId: number; clenId: number; pozicane: string; vratitDo: string }
): VypozickaDetail {
  const { lastInsertRowid } = db
    .prepare('INSERT INTO vypozicky (naradie_id, clen_id, pozicane, vratit_do) VALUES (?, ?, ?, ?)')
    .run(udaje.naradieId, udaje.clenId, udaje.pozicane, udaje.vratitDo);
  const vypozicka = najdiVypozicku(db, Number(lastInsertRowid));
  if (!vypozicka) throw new Error('Vytvorená výpožička sa nenašla.');
  return vypozicka;
}

export function oznacVratenie(db: Databaza, id: number, vratene: string): VypozickaDetail {
  db.prepare('UPDATE vypozicky SET vratene = ? WHERE id = ?').run(vratene, id);
  const vypozicka = najdiVypozicku(db, id);
  if (!vypozicka) throw new Error('Vrátená výpožička sa nenašla.');
  return vypozicka;
}
