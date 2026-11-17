import type { Clen, NaradieSoStavom, NoveNaradie, VypozickaDetail } from '../shared/types';

/** Chyba z API. Správa je text, ktorý server poslal v poli `chyba`, a dá sa ukázať používateľovi. */
export class ChybaApi extends Error {
  status: number;

  constructor(sprava: string, status: number) {
    super(sprava);
    this.status = status;
  }
}

async function poziadavka<T>(cesta: string, nastavenia: RequestInit = {}): Promise<T> {
  let odpoved: Response;
  try {
    odpoved = await fetch(`/api${cesta}`, {
      ...nastavenia,
      headers: { 'Content-Type': 'application/json', ...nastavenia.headers }
    });
  } catch {
    throw new ChybaApi('Server neodpovedá. Beží npm run dev?', 0);
  }

  const telo = await odpoved.json().catch(() => null);
  if (!odpoved.ok) {
    throw new ChybaApi(telo?.chyba ?? `Server vrátil chybu ${odpoved.status}.`, odpoved.status);
  }
  return telo as T;
}

export const api = {
  naradie: () => poziadavka<NaradieSoStavom[]>('/naradie'),

  pridajNaradie: (nove: NoveNaradie) =>
    poziadavka<NaradieSoStavom>('/naradie', { method: 'POST', body: JSON.stringify(nove) }),

  clenovia: () => poziadavka<Clen[]>('/clenovia'),

  vypozicky: () => poziadavka<VypozickaDetail[]>('/vypozicky'),

  pozicaj: (naradieId: number, clenId: number) =>
    poziadavka<VypozickaDetail>('/vypozicky', { method: 'POST', body: JSON.stringify({ naradieId, clenId }) }),

  vrat: (vypozickaId: number) => poziadavka<VypozickaDetail>(`/vypozicky/${vypozickaId}/vratenie`, { method: 'POST' })
};
