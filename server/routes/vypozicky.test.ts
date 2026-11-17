import { describe, expect, it } from 'vitest';
import type { Clen, NaradieSoStavom, VypozickaDetail } from '../../src/shared/types';
import { posli, TESTOVACI_DNES, vytvorTestovaciuAplikaciu } from '../test/pomocnik';

async function pripravenaAplikacia() {
  const { app } = vytvorTestovaciuAplikaciu();
  const naradie = (await posli(app, '/api/naradie', 'GET')).telo as NaradieSoStavom[];
  const clenovia = (await posli(app, '/api/clenovia', 'GET')).telo as Clen[];
  const idNaradia = (nazov: string) => naradie.find((n) => n.nazov === nazov)!.id;
  const idClena = (meno: string) => clenovia.find((c) => c.meno === meno)!.id;
  return { app, idNaradia, idClena };
}

describe('GET /api/vypozicky', () => {
  it('vráti nevrátené výpožičky, najskôr tie s najbližším termínom', async () => {
    const { app } = vytvorTestovaciuAplikaciu();
    const { telo } = await posli(app, '/api/vypozicky', 'GET');

    expect((telo as VypozickaDetail[]).map((v) => v.nazovNaradia)).toEqual([
      'Kosačka na trávu',
      'Stolárske svorky',
      'Aku vŕtačka 18 V',
      'Krížový laser'
    ]);
  });
});

describe('POST /api/vypozicky', () => {
  it('požičia dostupné náradie s termínom vrátenia o týždeň', async () => {
    const { app, idNaradia, idClena } = await pripravenaAplikacia();
    const { status, telo } = await posli(app, '/api/vypozicky', 'POST', {
      naradieId: idNaradia('Rýľ'),
      clenId: idClena('Jana Kováčová')
    });

    expect(status).toBe(201);
    expect(telo).toMatchObject({
      nazovNaradia: 'Rýľ',
      menoClena: 'Jana Kováčová',
      pozicane: TESTOVACI_DNES,
      vratitDo: '2026-03-17',
      vratene: null
    });
  });

  it('požičané náradie sa nedá požičať znova', async () => {
    const { app, idNaradia, idClena } = await pripravenaAplikacia();
    const { status, telo } = await posli(app, '/api/vypozicky', 'POST', {
      naradieId: idNaradia('Aku vŕtačka 18 V'),
      clenId: idClena('Jana Kováčová')
    });

    expect(status).toBe(409);
    expect(telo.chyba).toContain('je už požičané');
  });

  it('neznámy člen alebo chýbajúce údaje vrátia chybu', async () => {
    const { app, idNaradia } = await pripravenaAplikacia();

    expect((await posli(app, '/api/vypozicky', 'POST', { naradieId: idNaradia('Rýľ'), clenId: 999 })).status).toBe(404);
    expect((await posli(app, '/api/vypozicky', 'POST', { naradieId: idNaradia('Rýľ') })).status).toBe(400);
  });
});

describe('POST /api/vypozicky/:id/vratenie', () => {
  it('vráti náradie a to je potom znova dostupné', async () => {
    const { app, idNaradia } = await pripravenaAplikacia();
    const vrtacka = (await posli(app, `/api/naradie/${idNaradia('Aku vŕtačka 18 V')}`, 'GET')).telo as NaradieSoStavom;

    const { status, telo } = await posli(app, `/api/vypozicky/${vrtacka.vypozicka!.id}/vratenie`, 'POST');

    expect(status).toBe(200);
    expect(telo.vratene).toBe(TESTOVACI_DNES);
    expect((await posli(app, `/api/naradie/${vrtacka.id}`, 'GET')).telo.vypozicka).toBeNull();
  });

  it('vrátenú výpožičku nejde vrátiť druhýkrát', async () => {
    const { app, idNaradia } = await pripravenaAplikacia();
    const vrtacka = (await posli(app, `/api/naradie/${idNaradia('Aku vŕtačka 18 V')}`, 'GET')).telo as NaradieSoStavom;
    const cesta = `/api/vypozicky/${vrtacka.vypozicka!.id}/vratenie`;

    await posli(app, cesta, 'POST');
    expect((await posli(app, cesta, 'POST')).status).toBe(409);
  });
});
