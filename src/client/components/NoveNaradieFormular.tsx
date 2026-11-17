import { useState, type FormEvent } from 'react';
import { KATEGORIE } from '../../shared/kategorie';
import { MAX_DLZKA_NAZVU, overNoveNaradie } from '../../shared/naradie';
import type { NoveNaradie } from '../../shared/types';

const PRAZDNY = { nazov: '', kategoria: '', popis: '' };

/** Tlačidlo „Pridať náradie“, ktoré otvorí formulár. Údaje overí rovnako ako server. */
export function NoveNaradieFormular({ onPridaj }: { onPridaj: (nove: NoveNaradie) => Promise<boolean> }) {
  const [otvoreny, setOtvoreny] = useState(false);
  const [udaje, setUdaje] = useState(PRAZDNY);
  const [chyby, setChyby] = useState<string[]>([]);
  const [odosiela, setOdosiela] = useState(false);

  function zavri() {
    setOtvoreny(false);
    setUdaje(PRAZDNY);
    setChyby([]);
  }

  async function odosli(e: FormEvent) {
    e.preventDefault();
    const overenie = overNoveNaradie(udaje);
    if (!overenie.ok) {
      setChyby(overenie.chyby);
      return;
    }
    setOdosiela(true);
    const uspech = await onPridaj(overenie.hodnota);
    setOdosiela(false);
    if (uspech) zavri();
  }

  if (!otvoreny) {
    return (
      <button type="button" className="tlacidlo" onClick={() => setOtvoreny(true)}>
        Pridať náradie
      </button>
    );
  }

  return (
    <form className="panel formular" onSubmit={odosli} noValidate>
      <h2>Nové náradie</h2>

      <label className="pole-s-popisom">
        <span>Názov</span>
        <input
          className="pole"
          value={udaje.nazov}
          maxLength={MAX_DLZKA_NAZVU}
          onChange={(e) => setUdaje({ ...udaje, nazov: e.target.value })}
          autoFocus
        />
      </label>

      <label className="pole-s-popisom">
        <span>Kategória</span>
        <select className="pole" value={udaje.kategoria} onChange={(e) => setUdaje({ ...udaje, kategoria: e.target.value })}>
          <option value="" disabled>
            Vyberte kategóriu
          </option>
          {Object.entries(KATEGORIE).map(([kluc, nazov]) => (
            <option key={kluc} value={kluc}>
              {nazov}
            </option>
          ))}
        </select>
      </label>

      <label className="pole-s-popisom">
        <span>
          Popis <small>(nepovinný)</small>
        </span>
        <textarea
          className="pole"
          rows={2}
          value={udaje.popis}
          onChange={(e) => setUdaje({ ...udaje, popis: e.target.value })}
        />
      </label>

      {chyby.length > 0 && (
        <ul className="chyby-formulara" role="alert">
          {chyby.map((chyba) => (
            <li key={chyba}>{chyba}</li>
          ))}
        </ul>
      )}

      <div className="riadok-tlacidiel">
        <button type="submit" className="tlacidlo" disabled={odosiela}>
          Uložiť
        </button>
        <button type="button" className="tlacidlo tlacidlo-text" onClick={zavri}>
          Zrušiť
        </button>
      </div>
    </form>
  );
}
