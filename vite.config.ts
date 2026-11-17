/// <reference types="vitest/config" />
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Načíta aj premenné bez predpony VITE_, aby proxy poznala port API zo súboru .env.
  const env = loadEnv(mode, process.cwd(), '');
  const apiPort = env.API_PORT ?? '3001';

  return {
    plugins: [react()],
    server: {
      port: 5173,
      // Požiadavky na /api posiela Vite ďalej na server v Hono.
      proxy: {
        '/api': `http://localhost:${apiPort}`
      }
    },
    test: {
      environment: 'node',
      include: ['src/**/*.test.ts', 'server/**/*.test.ts']
    }
  };
});
