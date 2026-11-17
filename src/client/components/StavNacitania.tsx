import type { ReactNode } from 'react';
import type { Nacitanie } from '../useNacitanie';

type Props<T> = {
  stav: Nacitanie<T>;
  children: (data: T) => ReactNode;
};

/** Kým sa dáta načítavajú, ukáže text o načítaní. Pri chybe ponúkne nový pokus. Inak vykreslí obsah. */
export function StavNacitania<T>({ stav, children }: Props<T>) {
  if (stav.chyba) {
    return (
      <div className="chyba-nacitania" role="alert">
        <p>{stav.chyba}</p>
        <button type="button" className="tlacidlo tlacidlo-druhe" onClick={() => void stav.obnov()}>
          Skúsiť znova
        </button>
      </div>
    );
  }
  if (stav.data === null) return <p className="nacitavam">Načítavam…</p>;
  return <>{children(stav.data)}</>;
}
