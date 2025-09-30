<<<<<<< HEAD

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: './', // optional, defaults to project root
});
=======
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
})
>>>>>>> 7271d0a7ef74e53aebe1f767a8009ad6ea7b4101
