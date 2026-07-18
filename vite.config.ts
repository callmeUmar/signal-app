import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    proxy: {
      '/analyze': 'http://localhost:5000',
      '/stems':   'http://localhost:5000',
    },
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      // Relative paths are resolved from the project root (where this config lives)
      input: {
        landing:     'pages/landing.html',
        upload:      'pages/upload.html',
        'pick-five': 'pages/pick-five.html',
        tuning:      'pages/tuning.html',
        keyboard:    'pages/keyboard.html',
      },
    },
  },
})
