import { useCallback, useEffect, useState } from 'react';

export type Nacitanie<T> = {
  data: T | null;
  chyba: string | null;
  nacitava: boolean;
  obnov: () => Promise<void>;
};

/**
 * Načíta dáta z API pri prvom zobrazení komponentu.
 * Funkcia `nacitaj` musí byť stála (napríklad api.naradie), inak by sa dáta načítavali stále dookola.
 */
export function useNacitanie<T>(nacitaj: () => Promise<T>): Nacitanie<T> {
  const [data, setData] = useState<T | null>(null);
  const [chyba, setChyba] = useState<string | null>(null);
  const [nacitava, setNacitava] = useState(true);

  const obnov = useCallback(async () => {
    setNacitava(true);
    try {
      setData(await nacitaj());
      setChyba(null);
    } catch (e) {
      setChyba(e instanceof Error ? e.message : 'Dáta sa nepodarilo načítať.');
    } finally {
      setNacitava(false);
    }
  }, [nacitaj]);

  useEffect(() => {
    void obnov();
  }, [obnov]);

  return { data, chyba, nacitava, obnov };
}
