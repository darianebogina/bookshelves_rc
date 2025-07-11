import { defineConfig } from 'vite';

export default defineConfig({
    root: '.',
    server: {
        open: '/index.html',
    },
    build: {
        outDir: 'dist',      // Куда складывать собранные файлы
        emptyOutDir: true,   // Очистить папку перед сборкой
        rollupOptions: {
            input: {
                main: 'index.html',
                book: 'book.html',
                favorites: 'favorites.html',
            }
        }
    }
});
