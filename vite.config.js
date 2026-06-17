import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'resources/js'),
        },
    },
    plugins: [
        // The Laravel plugin manages the dev server / build manifest and refuses
        // to start under CI (CI=true). It is irrelevant to Vitest, so skip it
        // during tests — otherwise `vitest` trips its "no HMR server in CI" guard.
        ...(process.env.VITEST
            ? []
            : [
                  laravel({
                      input: 'resources/js/app.jsx',
                      refresh: true,
                  }),
              ]),
        react(),
    ],
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: './resources/js/tests/setup.js',
    },
});
