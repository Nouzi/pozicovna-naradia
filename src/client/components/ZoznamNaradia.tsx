import type { Clen, NaradieSoStavom } from '../../shared/types';
import { KartaNaradia } from './KartaNaradia';

type Props = {
  naradie: NaradieSoStavom[];
  clenovia: Clen[];
  onPozicaj: (naradieId: number, clenId: number) => Promise<boolean>;
  onVrat: (vypozickaId: number) => Promise<boolean>;
};

export function ZoznamNaradia({ naradie, clenovia, onPozicaj, onVrat }: Props) {
  if (naradie.length === 0) {
    return <p className="prazdne">Takéto náradie sme nenašli. Skúste iné slovo alebo kategóriu.</p>;
  }

  return (
    <ul className="mriezka">
      {naradie.map((n) => (
        <li key={n.id}>
          <KartaNaradia naradie={n} clenovia={clenovia} onPozicaj={onPozicaj} onVrat={onVrat} />
        </li>
      ))}
    </ul>
  );
}
