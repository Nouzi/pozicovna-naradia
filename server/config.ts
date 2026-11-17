// Nastavenia servera z premenných prostredia. Ak existuje súbor .env, načíta sa.
try {
  process.loadEnvFile();
} catch {
  // Súbor .env neexistuje, platia predvolené hodnoty.
}

// Vlastný názov namiesto PORT, ktorý často nastavujú iné nástroje (napríklad pre Vite).
export const PORT = Number(process.env.API_PORT ?? 3001);
export const DB_PATH = process.env.DB_PATH ?? 'data/dielna.db';
