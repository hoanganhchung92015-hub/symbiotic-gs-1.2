import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load biến môi trường dựa trên mode (development/production)
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    define: {
      // Cách gọi an toàn hơn, không gây lỗi TypeScript
      'process.env.VITE_GEMINI_API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY),
    },
    server: {
      port: 3000,
      host: true,
    },
    build: {
      outDir: 'dist',
      sourcemap: true,
    }
  };
});
