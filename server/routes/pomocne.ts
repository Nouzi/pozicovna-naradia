import type { Context } from 'hono';

/** Prevedie id z URL alebo z tela požiadavky na kladné celé číslo. Neplatné id vráti ako null. */
export function parsujId(hodnota: unknown): number | null {
  const id = typeof hodnota === 'string' && hodnota.trim() !== '' ? Number(hodnota) : hodnota;
  return typeof id === 'number' && Number.isInteger(id) && id > 0 ? id : null;
}

/** Načíta JSON z tela požiadavky. Pri neplatnom JSON vráti null namiesto chyby. */
export async function nacitajTelo(c: Context): Promise<unknown> {
  return c.req.json().catch(() => null);
}
