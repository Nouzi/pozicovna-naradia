import { useState } from 'react';
import { filtrujNaradie, PRAZDNY_FILTER, type Filter } from '../../shared/hladanie';
import type { Clen, NaradieSoStavom, NoveNaradie } from '../../shared/types';
import type { Nacitanie } from '../useNacitanie';
import { NoveNaradieFormular } from './NoveNaradieFormular';
import { StavNacitania } from './StavNacitania';
import { Vyhladavanie } from './Vyhladavanie';
import { ZoznamNaradia } from './ZoznamNaradia';

type Props = {
  stav: Nacitanie<NaradieSoStavom[]>;
  clenovia: Clen[];
  onPozicaj: (naradieId: number, clenId: number) => Promise<boolean>;
  onVrat: (vypozickaId: number) => Promise<boolean>;
  onPridaj: (nove: NoveNaradie) => Promise<boolean>;
};

export function StrankaNaradia({ stav, clenovia, onPozicaj, onVrat, onPridaj }: Props) {
  const [filter, setFilter] = useState<Filter>(PRAZDNY_FILTER);

  return (
    <section>
      <div className="stranka-hlavicka">
        <h1>Náradie</h1>
        <NoveNaradieFormular onPridaj={onPridaj} />
      </div>

      <Vyhladavanie filter={filter} onZmena={setFilter} />

      <StavNacitania stav={stav}>
        {(naradie) => (
          <ZoznamNaradia
            naradie={filtrujNaradie(naradie, filter)}
            clenovia={clenovia}
            onPozicaj={onPozicaj}
            onVrat={onVrat}
          />
        )}
      </StavNacitania>
    </section>
  );
}
