import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    //qr code ipv4
  host: "0.0.0.0",
  strictPort: true,
  port: 5173,
   
  },
});
