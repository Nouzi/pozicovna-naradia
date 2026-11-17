export type Zalozka = 'naradie' | 'vypozicky';

type Props = {
  zalozka: Zalozka;
  onZmena: (zalozka: Zalozka) => void;
  pocetVypoziciek?: number;
};

export function Hlavicka({ zalozka, onZmena, pocetVypoziciek }: Props) {
  return (
    <header className="hlavicka">
      <div className="hlavicka-vnutro">
        <div className="znacka">
          <span className="znacka-ikona" aria-hidden="true" />
          Požičovňa náradia
        </div>

        <nav className="zalozky" aria-label="Sekcie">
          <button
            type="button"
            className="zalozka"
            aria-current={zalozka === 'naradie' ? 'page' : undefined}
            onClick={() => onZmena('naradie')}
          >
            Náradie
          </button>
          <button
            type="button"
            className="zalozka"
            aria-current={zalozka === 'vypozicky' ? 'page' : undefined}
            onClick={() => onZmena('vypozicky')}
          >
            Výpožičky
            {pocetVypoziciek !== undefined && <span className="pocet">{pocetVypoziciek}</span>}
          </button>
        </nav>
      </div>
    </header>
  );
}
