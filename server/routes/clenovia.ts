import { Hono } from 'hono';
import type { Kontext } from '../kontext';
import { zoznamClenov } from '../repo/clenovia';

// /api/clenovia
export function clenoviaRoutes({ db }: Kontext) {
  return new Hono().get('/', (c) => c.json(zoznamClenov(db)));
}
