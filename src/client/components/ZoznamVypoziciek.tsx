import { formatujDatum } from '../../shared/datum';
import type { VypozickaDetail } from '../../shared/types';
import type { Nacitanie } from '../useNacitanie';
import { StavNacitania } from './StavNacitania';

type Props = {
  stav: Nacitanie<VypozickaDetail[]>;
  onVrat: (vypozickaId: number) => Promise<boolean>;
};

/** Nevrátené výpožičky zoradené podľa termínu vrátenia. */
export function ZoznamVypoziciek({ stav, onVrat }: Props) {
  return (
    <section>
      <div className="stranka-hlavicka">
        <h1>Výpožičky</h1>
      </div>

      <StavNacitania stav={stav}>
        {(vypozicky) =>
          vypozicky.length === 0 ? (
            <p className="prazdne">Všetko náradie je v dielni.</p>
          ) : (
            <div className="tabulka-obal">
              <table className="tabulka">
                <thead>
                  <tr>
                    <th>Náradie</th>
                    <th>Člen</th>
                    <th>Požičané</th>
                    <th>Vrátiť do</th>
                    <th>
                      <span className="sr-only">Akcia</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {vypozicky.map((v) => (
                    <tr key={v.id}>
                      <td className="bunka-nazov">{v.nazovNaradia}</td>
                      <td>{v.menoClena}</td>
                      <td>{formatujDatum(v.pozicane)}</td>
                      <td>{formatujDatum(v.vratitDo)}</td>
                      <td className="bunka-akcia">
                        <button type="button" className="tlacidlo tlacidlo-druhe" onClick={() => void onVrat(v.id)}>
                          Vrátiť
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }
      </StavNacitania>
    </section>
  );
}
