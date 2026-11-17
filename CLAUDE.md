# Požičovňa náradia

Webová aplikácia pre komunitnú dielňu: evidencia náradia, členov a výpožičiek. Frontend je React s Vite, API je Hono na Node.js, databáza SQLite cez vstavaný modul `node:sqlite`.

## Príkazy

- `npm run dev` spustí API (port 3001) aj web (port 5173)
- `npm test` spustí testy, `npm run typecheck` skontroluje typy
- `npm run db:reset` zmaže lokálnu databázu a naplní ju testovacími dátami

## Štruktúra

- `src/client` frontend, komponenty sú v `src/client/components`
- `src/shared` typy a doménová logika, ktoré používa frontend aj server
- `server/routes` endpointy, `server/repo` SQL dotazy, `server/db` migrácie a testovacie dáta

## Pravidlá

- Píš čistý, čitateľný a dobre štruktúrovaný kód.
- Doménové pojmy (náradie, člen, výpožička) pomenúvaj v kóde po slovensky bez diakritiky, technické pojmy po anglicky.
- Texty v rozhraní a chybové hlášky z API sú po slovensky s diakritikou.
- Dátumy ukladaj a posielaj ako text RRRR-MM-DD. Na prácu s nimi používaj funkcie zo `src/shared/datum.ts`.
- Logika, ktorú potrebuje frontend aj server, patrí do `src/shared`.
- Pred dokončením úlohy spusti `npm test` a `npm run typecheck`.
- Pred odovzdaním vždy spusti `npm run lint`.
- Nikdy netvrď, že je úloha hotová, kým neprejdú všetky testy.

## Pridanie migrácie databázy

Keď meníš štruktúru databázy, postupuj takto:

1. V `server/db/migrations` vytvor nový súbor s nasledujúcim číslom, napríklad `005_rezervacie.sql`. Čísla sa nesmú opakovať a migrácie sa spúšťajú v abecednom poradí.
2. Existujúce migrácie nikdy neupravuj. Už mohli prebehnúť v databáze niekoho iného. Každá zmena je nová migrácia.
3. Na začiatok súboru napíš komentár `--`, čo migrácia robí a prečo.
4. Nový stĺpec v existujúcej tabuľke musí mať `NOT NULL` s hodnotou `DEFAULT`, alebo byť nepovinný. Inak migrácia zlyhá na tabuľke, ktorá už má riadky.
5. Názvy tabuliek a stĺpcov píš po slovensky bez diakritiky a v množnom čísle pre tabuľky (`clenovia`, `vypozicky`).
6. Uprav typy v `src/shared/types.ts` a mapovanie riadkov v príslušnom súbore v `server/repo`.
7. Ak sa zmena týka testovacích dát, uprav `server/db/seed.ts`.
8. Spusti `npm run db:reset` a over, že sa migrácia spustí bez chyby.
9. Do testov pridaj prípad, ktorý novú štruktúru používa. Testy bežia nad databázou v pamäti, migrácie sa v nich spúšťajú automaticky.
