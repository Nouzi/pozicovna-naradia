import { useCallback, useState } from 'react';
import { api } from './api';
import { Hlavicka, type Zalozka } from './components/Hlavicka';
import { Oznamenie, type Sprava } from './components/Oznamenie';
import { StrankaNaradia } from './components/StrankaNaradia';
import { ZoznamVypoziciek } from './components/ZoznamVypoziciek';
import { useNacitanie } from './useNacitanie';

export function App() {
  const [zalozka, setZalozka] = useState<Zalozka>('naradie');
  const [sprava, setSprava] = useState<Sprava | null>(null);
  const naradie = useNacitanie(api.naradie);
  const vypozicky = useNacitanie(api.vypozicky);
  const clenovia = useNacitanie(api.clenovia);
  const zavrietSpravu = useCallback(() => setSprava(null), []);

  /** Spustí akciu na serveri, ukáže výsledok a znova načíta náradie aj výpožičky. Vráti, či akcia uspela. */
  async function vykonaj(akcia: () => Promise<unknown>, textUspechu: string): Promise<boolean> {
    try {
      await akcia();
      setSprava({ typ: 'uspech', text: textUspechu });
      return true;
    } catch (chyba) {
      setSprava({ typ: 'chyba', text: chyba instanceof Error ? chyba.message : 'Niečo sa pokazilo.' });
      return false;
    } finally {
      await Promise.all([naradie.obnov(), vypozicky.obnov()]);
    }
  }

  const vrat = (vypozickaId: number) => vykonaj(() => api.vrat(vypozickaId), 'Náradie je späť v dielni.');

  return (
    <>
      <Hlavicka zalozka={zalozka} onZmena={setZalozka} pocetVypoziciek={vypozicky.data?.length} />
      <main className="obsah">
        {sprava && <Oznamenie sprava={sprava} onZavriet={zavrietSpravu} />}

        {zalozka === 'naradie' ? (
          <StrankaNaradia
            stav={naradie}
            clenovia={clenovia.data ?? []}
            onPozicaj={(naradieId, clenId) => vykonaj(() => api.pozicaj(naradieId, clenId), 'Náradie je požičané.')}
            onVrat={vrat}
            onPridaj={(nove) => vykonaj(() => api.pridajNaradie(nove), `Náradie ${nove.nazov} je v zozname.`)}
          />
        ) : (
          <ZoznamVypoziciek stav={vypozicky} onVrat={vrat} />
        )}
      </main>
    </>
  );
}
