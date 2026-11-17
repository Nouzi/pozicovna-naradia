import { useEffect } from 'react';

export type Sprava = { typ: 'uspech' | 'chyba'; text: string };

const SKRYT_USPECH_PO_MS = 4000;

/** Pruh so správou nad obsahom. Úspech sa sám skryje, chyba zostane, kým ju používateľ nezavrie. */
export function Oznamenie({ sprava, onZavriet }: { sprava: Sprava; onZavriet: () => void }) {
  useEffect(() => {
    if (sprava.typ !== 'uspech') return;
    const casovac = setTimeout(onZavriet, SKRYT_USPECH_PO_MS);
    return () => clearTimeout(casovac);
  }, [sprava, onZavriet]);

  return (
    <div className={`oznamenie oznamenie-${sprava.typ}`} role={sprava.typ === 'chyba' ? 'alert' : 'status'}>
      <span>{sprava.text}</span>
      <button type="button" className="tlacidlo-zavriet" onClick={onZavriet} aria-label="Zavrieť správu">
        ×
      </button>
    </div>
  );
}
