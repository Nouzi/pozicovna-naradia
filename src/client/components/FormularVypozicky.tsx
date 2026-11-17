import { useState, type FormEvent } from 'react';
import type { Clen } from '../../shared/types';

type Props = {
  clenovia: Clen[];
  onPotvrdit: (clenId: number) => Promise<void>;
  onZrusit: () => void;
};

/** Výber člena, ktorému sa náradie požičia. */
export function FormularVypozicky({ clenovia, onPotvrdit, onZrusit }: Props) {
  const [clenId, setClenId] = useState('');
  const [odosiela, setOdosiela] = useState(false);

  async function odosli(e: FormEvent) {
    e.preventDefault();
    if (!clenId) return;
    setOdosiela(true);
    await onPotvrdit(Number(clenId));
    setOdosiela(false);
  }

  return (
    <form className="formular-vypozicky" onSubmit={odosli}>
      <select
        className="pole"
        aria-label="Komu požičať"
        value={clenId}
        onChange={(e) => setClenId(e.target.value)}
        autoFocus
        required
      >
        <option value="" disabled>
          Komu požičať?
        </option>
        {clenovia.map((c) => (
          <option key={c.id} value={c.id}>
            {c.meno}
          </option>
        ))}
      </select>
      <div className="riadok-tlacidiel">
        <button type="submit" className="tlacidlo" disabled={!clenId || odosiela}>
          Požičať
        </button>
        <button type="button" className="tlacidlo tlacidlo-text" onClick={onZrusit}>
          Zrušiť
        </button>
      </div>
    </form>
  );
}
