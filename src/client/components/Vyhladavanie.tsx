import type { Filter } from '../../shared/hladanie';
import { KATEGORIE } from '../../shared/kategorie';

type Props = {
  filter: Filter;
  onZmena: (filter: Filter) => void;
};

export function Vyhladavanie({ filter, onZmena }: Props) {
  return (
    <div className="vyhladavanie" role="search">
      <input
        type="search"
        className="pole pole-hladat"
        placeholder="Hľadať náradie…"
        aria-label="Hľadať náradie"
        value={filter.text}
        onChange={(e) => onZmena({ ...filter, text: e.target.value })}
      />

      <select
        className="pole"
        aria-label="Kategória"
        value={filter.kategoria}
        onChange={(e) => onZmena({ ...filter, kategoria: e.target.value as Filter['kategoria'] })}
      >
        <option value="vsetky">Všetky kategórie</option>
        {Object.entries(KATEGORIE).map(([kluc, nazov]) => (
          <option key={kluc} value={kluc}>
            {nazov}
          </option>
        ))}
      </select>

      <label className="prepinac">
        <input
          type="checkbox"
          checked={filter.ibaDostupne}
          onChange={(e) => onZmena({ ...filter, ibaDostupne: e.target.checked })}
        />
        Iba dostupné
      </label>
    </div>
  );
}
