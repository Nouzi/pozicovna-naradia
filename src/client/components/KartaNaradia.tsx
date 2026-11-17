import { useState } from 'react';
import { formatujDatum } from '../../shared/datum';
import { KATEGORIE } from '../../shared/kategorie';
import type { Clen, NaradieSoStavom } from '../../shared/types';
import { FormularVypozicky } from './FormularVypozicky';

type Props = {
  naradie: NaradieSoStavom;
  clenovia: Clen[];
  onPozicaj: (naradieId: number, clenId: number) => Promise<boolean>;
  onVrat: (vypozickaId: number) => Promise<boolean>;
};

export function KartaNaradia({ naradie, clenovia, onPozicaj, onVrat }: Props) {
  const [vyberaClena, setVyberaClena] = useState(false);
  const { vypozicka } = naradie;

  async function pozicaj(clenId: number) {
    if (await onPozicaj(naradie.id, clenId)) setVyberaClena(false);
  }

  return (
    <article className="karta">
      <div className="karta-kategoria">{KATEGORIE[naradie.kategoria]}</div>
      <h2 className="karta-nazov">{naradie.nazov}</h2>
      {naradie.popis && <p className="karta-popis">{naradie.popis}</p>}

      <div className="karta-pata">
        {vypozicka ? (
          <>
            <p className="stav stav-pozicane">
              Má {vypozicka.menoClena}
              <span>vrátiť do {formatujDatum(vypozicka.vratitDo)}</span>
            </p>
            <button type="button" className="tlacidlo tlacidlo-druhe" onClick={() => void onVrat(vypozicka.id)}>
              Vrátiť
            </button>
          </>
        ) : vyberaClena ? (
          <FormularVypozicky clenovia={clenovia} onPotvrdit={pozicaj} onZrusit={() => setVyberaClena(false)} />
        ) : (
          <>
            <p className="stav stav-dostupne">V dielni</p>
            <button type="button" className="tlacidlo" onClick={() => setVyberaClena(true)}>
              Požičať
            </button>
          </>
        )}
      </div>
    </article>
  );
}
