import { describe, expect, it } from 'vitest';
import type { NaradieSoStavom } from '../../src/shared/types';
import { posli, vytvorTestovaciuAplikaciu } from '../test/pomocnik';

describe('GET /api/naradie', () => {
  it('vráti všetko náradie aj s tým, kto ho má požičané', async () => {
    const { app } = vytvorTestovaciuAplikaciu();
    const { status, telo } = await posli(app, '/api/naradie', 'GET');
    const zoznam = telo as NaradieSoStavom[];

    expect(status).toBe(200);
    expect(zoznam).toHaveLength(18);
    expect(zoznam.find((n) => n.nazov === 'Aku vŕtačka 18 V')?.vypozicka).toMatchObject({
      menoClena: 'Peter Horváth',
      vratitDo: '2026-03-14'
    });
    expect(zoznam.find((n) => n.nazov === 'Rýľ')?.vypozicka).toBeNull();
  });
});

describe('GET /api/naradie/:id', () => {
  it('pri neznámom alebo neplatnom id vráti 404', async () => {
    const { app } = vytvorTestovaciuAplikaciu();
    expect((await posli(app, '/api/naradie/999', 'GET')).status).toBe(404);
    expect((await posli(app, '/api/naradie/abc', 'GET')).status).toBe(404);
  });
});

describe('POST /api/naradie', () => {
  it('pridá náradie', async () => {
    const { app } = vytvorTestovaciuAplikaciu();
    const { status, telo } = await posli(app, '/api/naradie', 'POST', {
      nazov: 'Teplovzdušná pištoľ',
      kategoria: 'elektricke',
      popis: ''
    });

    expect(status).toBe(201);
    expect(telo).toMatchObject({ nazov: 'Teplovzdušná pištoľ', kategoria: 'elektricke', vypozicka: null });
    expect((await posli(app, `/api/naradie/${telo.id}`, 'GET')).status).toBe(200);
  });

  it('neplatné údaje odmietne s popisom chyby', async () => {
    const { app } = vytvorTestovaciuAplikaciu();
    const { status, telo } = await posli(app, '/api/naradie', 'POST', { nazov: '', kategoria: 'elektricke' });

    expect(status).toBe(400);
    expect(telo.chyba).toBe('Zadajte názov náradia.');
  });
});

describe('neznáma adresa', () => {
  it('vráti 404 s chybou v JSON', async () => {
    const { app } = vytvorTestovaciuAplikaciu();
    const { status, telo } = await posli(app, '/api/nieco', 'GET');

    expect(status).toBe(404);
    expect(telo).toHaveProperty('chyba');
  });
});
